import type { RequestHandler } from '@sveltejs/kit';
import { error, json as json$1 } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { z } from 'zod';

// takes many ids
// updates all of them with given data
import { reportZodOrPrismaError } from '$lib/api-utils';
import { db } from '$lib/db';
import parse from '$lib/parse';
import { PatchArticleData } from '$lib/types/schemas/Article';
import { getJsonFromRequest } from '$lib/utils';

// TODO: add type support for data
const patchRequest = z.object({
	ids: z.array(z.number().or(z.string())).nonempty(),
	data: PatchArticleData,
	// data: ArticleModel
});

// TODO: add tags (i.e. provide array that gets added, not replaced)

// bulk post articles from urls
export const POST: RequestHandler = async ({ request, locals }) => {
	const json = await getJsonFromRequest(request);
	console.log({ json });
	try {
		const articles = [];
		for (const url of json.urls[0].split('\n')) {
			console.log({ url });
			if (!url) continue;
			const article = await parse(url, undefined);
			articles.push({
				...article,
				url,
				title: article.title || '',
				author: article.author || '',
				image: article.image || '',
				date: dayjs(article.published).isValid()
					? dayjs(article.published).format()
					: dayjs().format(),
				textContent: article.textContent,
			});
		}
		const body = await db.article.createMany({
			data: articles,
			skipDuplicates: true,
		});
		return new Response(undefined, {
			status: 200,
		});
	} catch (e) {
		console.error(e);
		return new Response(undefined, { status: 400 });
	}
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
	try {
		const session = await locals.validate();
		if (!session) {
			throw error(401, 'unauthorized');
		}
		const json = await getJsonFromRequest(request);
		const parsed = patchRequest.parse(json);
		const articles = await db.$transaction(
			parsed.ids.map((id) => {
				return db.article.update({
					where: {
						id: Number(id),
					},
					data: parsed.data,
				});
			})
		);
		console.log({ articles });
		// does it need to return anything?
		return new Response(undefined);
	} catch (e) {
		console.error(e);
		return json$1(
			{
				error: reportZodOrPrismaError(e),
			},
			{
				status: 400,
			}
		);
	}
};
