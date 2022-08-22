import { json as json$1 } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
import { FavoriteSchema, _FavoriteArgs } from '$lib/types/schemas/Favorite';
import { z } from 'zod';

export const GET: RequestHandler = async () => {
	const favorites = await db.favorite.findMany(_FavoriteArgs);
	return json$1({ favorites });
};

const generateNegativePositionWithTwoDecimals = (): number => {
	return Math.floor(Math.random() * -2000 * 100) / 100;
};

export const POST: RequestHandler = async ({ request }) => {
	// create a new favorite
	const json = await getJsonFromRequest(request);
	const favData = FavoriteSchema.parse(json);
	console.log({ favData });
	// todo: fix that negative position is random and won't actually add to top!
	const favorite = await db.favorite.create({
		data: {
			...favData,
			position: generateNegativePositionWithTwoDecimals()
		}
	});
	return json$1({ id: favorite.id });
};

export const DELETE: RequestHandler = async ({ request }) => {
	// create a new favorite
	const json = await getJsonFromRequest(request);
	try {
		const toDelete = z
			.object({
				id: z.number().int().nonnegative()
			})
			.parse(json);
		const favorite = await db.favorite.delete({
			where: {
				id: toDelete.id
			}
		});
		return new Response(undefined);
	} catch (e) {
		console.error(e);
		return new Response(undefined, { status: 400 });
	}
};
