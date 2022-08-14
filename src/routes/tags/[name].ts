import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	console.log({ params });
	const tag = await db.tag.findFirst({
		where: {
			name: {
				equals: params.name
				// mode: 'insensitive' <- for when i use postgres
			}
		},
		include: {
			articles: {
				select: {
					id: true,
					title: true,
					image: true,
					description: true,
					date: true,
					url: true,
					createdAt: true,
					author: true
				}
			},
			favorite: true
		}
	});
	console.log({ tag });
	if (tag) {
		console.log('returning tag');
		return {
			body: { tag },
			status: 200
		};
	}
	return {
		status: 404
	};
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	console.log({ params });
	const json = getJsonFromRequest(request);
	const tag = await db.tag.update({
		where: {
			name: params.name
		},
		data: {
			...json
		}
	});
	console.log({ tag });
	if (tag) {
		console.log('returning tag');
		return {
			body: { tag },
			status: 200
		};
	}
	return {
		status: 404
	};
};
