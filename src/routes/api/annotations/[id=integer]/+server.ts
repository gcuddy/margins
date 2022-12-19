import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

import { db } from '$lib/db';

import type { RequestHandler } from './$types';

const PatchSchema = z
	.object({
		readLater: z.boolean(),
		private: z.boolean(),
		tags: z.object({
			name: z.string(),
			id: z.number().optional(),
		}),
		stateId: z.number(),
		deleted: z.date().or(z.string().datetime()),
	})
	.partial();

export const PATCH: RequestHandler = async ({ params, locals, request }) => {
	const session = await locals.validate();
	if (!session) {
		throw error(401);
	}
	try {
		const { id } = params;
		const data = await request.json();
		const { private: _private, stateId } = PatchSchema.parse(data);
		//TODO: verify
		const annotation = await db.annotation.update({
			where: {
				id: parseInt(id),
				userId: session.userId,
			},
			data: {
				private: _private,
				state: {
					connect: {
						id: stateId,
					},
				},
			},
		});
		return json(annotation);
	} catch (e) {
		console.error(e);
		return new Response(undefined, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const session = await locals.validate();
	if (!session) {
		throw error(401);
	}
	try {
		const { id } = params;
		await db.annotation.delete({
			where: {
				id: parseInt(id),
				userId: session.userId,
			},
		});
		return new Response(undefined, {
			status: 204,
		});
	} catch (e) {
		console.error(e);
		return new Response(undefined, { status: 500 });
	}
};
