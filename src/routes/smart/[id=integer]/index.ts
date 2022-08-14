import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { z } from 'zod';

export const GET: RequestHandler = async ({ url, params }) => {
	console.time('smartlist');
	const list = await db.smartList.findFirst({
		where: {
			id: Number(params.id)
		},
		include: {
			favorite: true
		}
	});
	if (!list) {
		return {
			status: 400
		};
	}
	// duplicated from /fetch.json... not sure how to do this?
	const articles = await db.article.findMany({
		where: z.any().parse(list.filter),
		select: {
			id: true,
			title: true,
			author: true,
			tags: true,
			image: true,
			description: true,
			date: true,
			url: true,
			createdAt: true
		}
	});
	console.timeEnd('smartlist');
	return {
		status: 200,
		body: {
			articles,
			list
		}
	};
};
