import { zod } from '../utils/zod.js';
import { useUser } from '../user.js';
import { useTransaction } from '../utils/transaction.js';
import { z } from 'zod';
import type { Insertable } from 'kysely';
import type { Favorite } from '@margins/db/kysely/types';
import { FavoriteType } from '@margins/db/kysely/enums';

export const Schema = z.object({
	annotationId: z.string().optional(),
	bookmarkId: z.string().optional(),
	entryId: z.string().optional(),
	id: z.string(),
	type: z.nativeEnum(FavoriteType).default('FAVORITE'),
	updatedAt: z.date(),
	userId: z.string(),
}) satisfies z.ZodType<Insertable<Favorite>>;

export const create = zod(
	Schema.omit({
		updatedAt: true,
		userId: true,
	}),
	async (input) =>
		useTransaction(async (tx) => {
			return await tx
				.insertInto('Favorite')
				.values({
					...input,
					updatedAt: new Date(),
					userId: useUser().id,
				})
				.ignore()
				.executeTakeFirst();
		}),
);

export const remove = zod(
	Schema.pick({
		id: true,
	}),
	async (input) =>
		useTransaction(async (db) => {
			return await db
				.deleteFrom('Favorite')
				.where('id', '=', input.id)
				.where('userId', '=', useUser().id)
				.execute();
		}),
);
