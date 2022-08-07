import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { reportZodOrPrismaError } from '$lib/api-utils';

export const GET: RequestHandler = async ({ request, url }) => {
	const take = parseInt(url.searchParams.get('limit') || '20');
	const articles = await db.article.findMany({
		// this works since new articles will have dupe'd position of 0, but when re-arranged all will be ok
		orderBy: [
			{
				position: 'asc'
			},
			{
				updatedAt: 'desc'
			}
		],
		where: {
			NOT: {
				location: 'ARCHIVE'
			}
		},
		select: {
			title: true,
			tags: true,
			position: true,
			author: true,
			date: true,
			description: true,
			readProgress: true,
			wordCount: true,
			url: true,
			siteName: true,
			id: true,
			image: true,
			_count: {
				select: {
					annotations: true
				}
			}
		},
		take
	});
	const tags = articles.flatMap((article) => article.tags);
	if (articles.length) {
		return {
			body: {
				articles,
				tags
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

// TODO: middleware to properly order articles by position

export const PATCH: RequestHandler = async ({ request, locals }) => {
	// update many articles
	try {
		const data = await request.json();
		// const data = ArticleModel.partial()
		// 	.array()
		// 	.parse(await request.json());
		// should this be a batch transction?
		const articles = await Promise.all(
			data.map((article) =>
				db.article.update({
					where: {
						id: article.id
					},
					data: {
						...article
					}
				})
			)
		);
		return {
			status: 200,
			body: {
				articles
			}
		};
	} catch (e) {
		console.log(e);
		return {
			status: 400,
			error: reportZodOrPrismaError(e)
		};
	}
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	const form = await request.formData();
	const id = form.get('id') || form.get('ids');
	// this allows us to use ids in form of 123,456,789
	if (typeof id === 'string') {
		const ids = id
			.split(',')
			.map((n) => parseInt(n))
			.filter(Number.isFinite);
		const deletedArticles = await db.$transaction(
			ids.map((id) =>
				db.article.delete({
					where: {
						id
					}
				})
			)
		);

		return redirect;
	} else {
		return {
			status: 400,
			body: 'Invalid id'
		};
	}
};

// If the user has JavaScript disabled, the URL will change to
// include the method override unless we redirect back to /todos
const redirect = {
	status: 303,
	headers: {
		location: '/'
	}
};
