import parse from '../add/_parse';
// takes many ids
// updates all of them with given data

import { reportZodOrPrismaError } from '$lib/api-utils';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import dayjs from 'dayjs';
import { PatchArticleData } from '$lib/types/schemas/Article';

// TODO: add type support for data
const patchRequest = z.object({
	ids: z.array(z.number().or(z.string())).nonempty(),
	data: PatchArticleData
	// data: ArticleModel
});

// TODO: add tags (i.e. provide array that gets added, not replaced)

// bulk post articles from urls
export const POST: RequestHandler = async ({ request }) => {
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
				date: dayjs(article.date).isValid() ? dayjs(article.date).format() : dayjs().format(),
				textContent: article.textContent
			});
		}

		const body = await db.article.createMany({
			data: articles,
			skipDuplicates: true
		});
		return {
			status: 200,
			headers: {
				location: '/'
			}
		};
	} catch (e) {
		console.error(e);
		return {
			status: 400
		};
	}
};

export const PATCH: RequestHandler = async ({ request }) => {
	const json = await getJsonFromRequest(request);
	try {
		const parsed = patchRequest.parse(json);
		console.log({ parsed });
		const articles = await db.$transaction(
			parsed.ids.map((id) => {
				return db.article.update({
					where: {
						id: Number(id)
					},
					data: parsed.data
				});
			})
		);
		// does it need to return anything?
		return {
			status: 200
		};
	} catch (e) {
		console.error(e);
		return {
			status: 400,
			body: {
				error: reportZodOrPrismaError(e)
			}
		};
	}
};
