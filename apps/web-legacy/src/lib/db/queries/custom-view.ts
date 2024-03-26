import { db } from '$lib/db';

// MUTATIONS

import { customViewCreateInputSchema } from '$lib/schemas/inputs/custom-view.schema';
import type { GetCtx } from '../types';

async function customViewCreate({
	ctx,
	input,
}: GetCtx<typeof customViewCreateInputSchema>) {
	await db
		.insertInto('SmartList')
		.values({
			...input,
			userId: ctx.userId,
		})
		.execute();
}

const mutation = {
	schema: customViewCreateInputSchema,
	fn: customViewCreate,
} as const;

export { mutation as customViewCreate };
