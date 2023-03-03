import type { RequestHandler } from '@sveltejs/kit';
import { error, json as json$1 } from '@sveltejs/kit';
import { z } from 'zod';

import { db } from '$lib/db';
import { auth } from '$lib/server/lucia';
import { _FavoriteArgs, FavoriteSchema } from '$lib/types/schemas/Favorite';
import { getJsonFromRequest } from '$lib/utils';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.validate();
	const user = auth.getSessionUser(session.sessionId);
	console.log({ user });
	const favorites = await db.favorite.findMany(_FavoriteArgs);
	return json$1({ favorites });
};

const generateNegativePositionWithTwoDecimals = (): number => {
	return Math.floor(Math.random() * -2000 * 100) / 100;
};

export const POST: RequestHandler = async ({ request, locals }) => {
	// create a new favorite
	const { userId } = locals.validate();
	if (!userId) {
		throw error(401, 'Unauthorized');
	}
	const json = await getJsonFromRequest(request);
	const favData = FavoriteSchema.parse(json);
	console.log({ favData });
	// todo: fix that negative position is random and won't actually add to top!
	const favorite = await db.favorite.create({
		data: {
			...favData,
			userId,
		},
	});
	return json$1({ id: favorite.id });
};

export const DELETE: RequestHandler = async ({ request }) => {
	// create a new favorite
	const json = await getJsonFromRequest(request);
	try {
		const toDelete = z
			.object({
				id: z.number().int().nonnegative(),
			})
			.parse(json);
		const favorite = await db.favorite.delete({
			where: {
				id: toDelete.id,
			},
		});
		return new Response(undefined);
	} catch (e) {
		console.error(e);
		return new Response(undefined, { status: 400 });
	}
};
