import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

import { db } from '$lib/db';

import type { RequestHandler } from './$types';

// export const GET: RequestHandler = async ({ locals }) => {
// 	const session = await locals.validate();
// 	if (!session) {
// 		throw error(401, 'Not authorized');
// 	}
// 	const annotations = await db.annotation.findMany({
// 		where: {
// 			userId: session.userId,
// 		},
// 	});
// 	return json(annotations);
// };

const InteractionInput = z.object({
	id: z.number().optional(),
	userId: z.string().optional(),
	entryId: z.number(),
	is_read: z.boolean().optional(),
	finished: z.boolean().optional(),
	progress: z.number().optional(),
});

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.validate();
	if (!session) {
		throw error(401, 'Not authorized');
	}
	try {
		const data = await request.json();
		const parsed = InteractionInput.parse(data);
		const { is_read, finished, progress, entryId, userId, id } = parsed;
		const interaction = await db.entryInteraction.upsert({
			where: {
				id,
				documentId_userId: {
					userId: userId || session.userId,
					documentId: entryId,
				},
			},
			create: {
				userId: userId || session.userId,
				documentId: entryId,
				is_read,
				finished,
				progress,
				history: {
					create: {},
				},
			},
			update: {
				is_read,
				finished,
				progress,
				history: {
					create: {},
				},
			},
			select: {
				id: true,
				progress: true,
				is_read: true,
			},
		});
		return json(interaction);
	} catch (e) {
		console.error(e);
		throw error(400, 'Malformed request');
	}
};
