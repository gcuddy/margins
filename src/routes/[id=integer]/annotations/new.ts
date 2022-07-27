import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { reportZodOrPrismaError } from '$lib/api-utils';
export const GET: RequestHandler = async ({ params }) => {
	const id = parseInt(params.id);
	const article = await db.article.findUnique({
		where: {
			id
		}
	});
	return {
		status: 200,
		body: {
			article
		}
	};
};

export const POST: RequestHandler = async ({ request, params }) => {
	console.log('post request');
	try {
		const articleId = parseInt(params.id);
		const data = await request.formData();
		const text = <string>data.get('text');
		const annotation = await db.annotation.create({
			data: {
				text,
				articleId
			}
		});
		return {
			status: 200,
			body: {
				annotation
			}
		};
	} catch (e) {
		return {
			status: 400,
			body: {
				error: reportZodOrPrismaError(e)
			}
		};
	}
};
