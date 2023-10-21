import { z } from 'zod';

import { db } from '$lib/db';
import type { GetCtx } from '$lib/db/types';

export const tagInputSchema = z
	.object({
		id: z.number(),
		name: z.string(),
	})
	.partial()
	.refine((data) => {
		return data.id || data.name;
	}, 'Must have either id or name');

export function getTag({ ctx, input }: GetCtx<typeof tagInputSchema>) {
	const { id, name } = input;
	const { userId } = ctx;
	if (!id && !name) {
		throw new Error('Must provide either id or name');
	}
	let query = db
		.selectFrom('Tag')
		.leftJoin('Favorite as pin', 'pin.tagId', 'Tag.id')
		.select(['Tag.id', 'Tag.name', 'Tag.color', 'pin.id as pin_id'])
		.where('userId', '=', userId);

	if (id) {
		query = query.where('id', '=', id);
	}
	if (name) {
		query = query.where('name', '=', name);
	}
}
