// get gets annotations, post creates new annotation
import { db } from '$lib/db';
import type { Annotation } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const articles = await db.article.findMany();
	if (articles.length) {
		return {
			body: {
				articles
			}
		};
	} else {
		return {
			body: {
				articles: []
			}
		};
	}
};
// should these support body, or just form?
export const POST: RequestHandler = async ({ request, locals }) => {
	console.log('received post request');
	// const form = await request.formData();
	// const text = <string>form.get('text');
	// const articleId = <string>form.get('article-id');
	// console.log('articleId', articleId);
	// const highlightId = <string>form.get('highlight-id');

	const json = await request.json();
	if (!json) {
		return { status: 400, body: { error: 'No body' } };
	}
	const { text, articleId, highlightId } = json;
	console.log(articleId);
	let body: Annotation;
	if (highlightId) {
		body = await db.annotation.create({
			data: {
				text,
				articleId
			}
		});
	} else {
		body = await db.annotation.create({
			data: {
				text,
				articleId,
				highlightId
			}
		});
	}
	console.log('post body', body);
	return { status: 201, body };
};
