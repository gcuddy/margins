import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

import { db } from '$lib/db';
import { subscriptionApiSelect } from '$lib/feeds/types';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.validate();
	if (!session) {
		throw error(401, 'Not authorized');
	}
	// can't do findUnique because we need to ensure it matches the userId
	const subscription = await db.subscription.findFirst({
		where: {
			id: Number(params.id),
			userId: session.userId,
		},
		select: subscriptionApiSelect,
	});
	if (subscription) {
		return json(subscription);
	} else {
		throw error(403);
	}
};

// TODO: fill this out more
const patchRequestSchema = z.object({
	title: z.string(),
});
export const PATCH: RequestHandler = async ({ params, locals, request }) => {
	const session = {
		userId: 'clawrbftc0000qdq238od0o14',
	};
	// const session = await locals.validate();
	// if (!session) {
	// 	throw error(401, 'Not authorized');
	// }
	try {
		const data = await request.json();
		const { title } = patchRequestSchema.parse(data);
		const subscription = await db.subscription
			.update({
				where: {
					id: Number(params.id),
					userId: session.userId,
				},
				data: {
					title,
				},
				select: subscriptionApiSelect,
			})
			.catch((e) => {
				console.error(e);
				throw error(403);
			});
		return json(subscription);
	} catch (e) {
		console.error(e);
		throw error(400, 'Please provide title');
	}
	// process title from request
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const session = await locals.validate();
	if (!session) {
		throw error(401, 'Not authorized');
	}
	try {
		// is there no way to do this without two calls?
		await db.subscription.delete({
			where: {
				id: Number(params.id),
				userId: session.userId,
			},
		});
		return new Response(null, {
			status: 204,
		});
	} catch (e) {
		console.error(e);
		throw error(403, 'Not authorized to delete this subscription');
	}
};
