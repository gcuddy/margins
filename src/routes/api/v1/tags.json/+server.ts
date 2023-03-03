import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

import { db } from '$lib/db';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.validate();
	if (!session) {
		throw error(401, 'Not authorized');
	}
	const tags = await db.tag.findMany({
		where: {
			userId: session.userId,
		},
	});
	return json(tags);
};

const PostTag = z.object({
	name: z.string(),
});
export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.validate();
	if (!session) {
		throw error(401, 'Not authorized');
	}
	try {
		const data = await request.json();
		const parsed = PostTag.parse(data);
		const tag = await db.tag.create({
			data: {
				userId: session.userId,
				name: parsed.name,
			},
		});
		return json(tag);
	} catch (e) {
		console.error(e);
		throw error(400);
	}
};
