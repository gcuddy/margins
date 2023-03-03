// Bookmarks are just a special type of annotation

import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

import { getBookmarks } from '$lib/bookmark.server';

import type { RequestHandler } from './$types';

const locationSchema = z.enum(['inbox', 'soon', 'later', 'archive']);

export const GET: RequestHandler = async ({ locals, url }) => {
	const session = await locals.validate();
	if (!session) {
		throw error(401, 'Not authorized');
	}
	const location = locationSchema.safeParse(url.searchParams.get('location'));
	const state = url.searchParams.get('state');
	const take = Number(url.searchParams.get('limit')) || 20;
	const bookmarks = await getBookmarks({
		userId: session.userId,
		state: state ? Number(state) : undefined,
		location: location.success ? location.data : undefined,
		take,
	});
	// const bookmarks = await db.bookmark.findMany({
	// 	orderBy: [
	// 		{
	// 			updatedAt: 'desc',
	// 		},
	// 		{
	// 			sortOrder: 'asc',
	// 		},
	// 	],
	// 	where: {
	// 		userId: session.userId,
	// 		stateId: state ? Number(state) : undefined,
	// 		state: {
	// 			is: {
	// 				type: location.success ? location.data : undefined,
	// 			},
	// 		},
	// 	},
	// 	take,
	// });
	console.log('api/bookmarks', { bookmarks });
	return json(bookmarks);
};
