import { reportZodOrPrismaError } from '$lib/api-utils';
import { db } from '$lib/db';
import { formDataToJson, getJsonFromRequest } from '$lib/utils';
import type { Annotation } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

// return annotations associated with this article
export const GET: RequestHandler = async ({ params }) => {
	const id = parseInt(params.id);
	const article = await db.article.findUnique({
		where: {
			id
		},
		include: {
			annotations: true
		}
	});

	return {
		status: 200,
		body: {
			article
		}
	};
};

// post annotationc

const postSchema = z.object({
	text: z.string().array(),
	highlightId: z.string().optional()
});

export const POST: RequestHandler = async ({ request, params, url }) => {
	console.log('received post request test test');
	console.log({ params });
	console.log({ url });
	console.log({ request });
	const articleId = parseInt(params.id);
	try {
		// TODO: fix this
		// const json = await getJsonFromRequest(request);
		// console.log({ json });
		const { text, highlightId } = postSchema.parse(await getJsonFromRequest(request));
		// const data = await request.formData();
		// const text = data.get('text') as string;
		console.log({ text, articleId });
		const body = await db.annotation.create({
			data: {
				body: text[0],
				articleId
			}
		});
		// TODO: redirect
		console.log('post body', body);
		return {
			status: 201,
			body,
			headers: {
				Location: `/${articleId}/annotationss`
			}
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

export const PATCH: RequestHandler = async ({ params, request }) => {
	const { id: articleId } = params;
	const json = await request.json();
	if (articleId && json) {
		await db.annotation.update({
			where: {}
		});

		const article = await db.article.update({
			where: {
				id: parseInt(articleId)
			},
			data: { ...json }
		});
		return {
			status: 303,
			headers: {
				Location: `/${id}`
			}
		};
	}
	return {
		status: 303
	};
};
