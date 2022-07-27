import type { RequestHandler } from './__types/RequestHandler';
import { db } from '$lib/db';

export const GET: RequestHandler = async ({ params, url }) => {
	const { id } = params;
	console.log(`fetching article with id ${id}`);
	const article = await db.article.findFirst({
		where: {
			id: parseInt(id as string)
		},
		include: {
			annotations: true,
			tags: true,
			context: {
				include: {
					Article: {
						select: {
							id: true,
							title: true
						}
					}
				}
			}
		}
	});
	if (article) {
		return {
			body: {
				article
			},
			headers: {
				location: `/articles/${id}`
			}
		};
	} else {
		return {
			status: 404
		};
	}
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const { id } = params;
	console.log('patch', id);
	console.log(request.headers.get('content-type'));
	const json = await request.json();
	console.log('patch', { json });

	if (id && json) {
		console.log('inside id and json patching');
		const article = await db.article.update({
			where: {
				id: parseInt(id)
			},
			data: { ...json },
			include: {
				annotations: true,
				highlights: true,
				tags: true
			}
		});
		return {
			status: 200,
			body: article
		};
	} else {
		return {
			status: 303
		};
	}
};

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
	const { text, articleId, highlightId, type } = json;
	console.log(articleId);
	const body = await db.annotation.create({
		data: {
			text,
			articleId,
			highlightId
		}
	});
	console.log('post body', body);
	return { status: 201, body };
};

export const DELETE: RequestHandler = async ({ params }) => {
	const { id } = params;
	// this allows us to use ids in form of 123,456,789
	console.log(`deleting id ${id}`);
	const deletedArticle = await db.article.delete({
		where: {
			id: parseInt(id)
		}
	});
	console.log({ deletedArticle });
	return {
		status: 200,
		body: {
			deletedArticle
		}
	};
};
