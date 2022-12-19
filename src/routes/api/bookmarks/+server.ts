// Bookmarks are just a special type of annotation

import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

import { annotationExtendedInclude } from '$lib/annotation';
import { db } from '$lib/db';

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
	const bookmarks = await db.annotation.findMany({
		orderBy: [
			{
				updatedAt: 'desc',
			},
			{
				sortOrder: 'asc',
			},
		],
		where: {
			userId: session.userId,
			type: 'bookmark',
			stateId: state ? Number(state) : undefined,
			state: {
				is: {
					type: location.success ? location.data : undefined,
				},
			},
		},
		include: annotationExtendedInclude,
		take,
	});
	return json(bookmarks);
};
