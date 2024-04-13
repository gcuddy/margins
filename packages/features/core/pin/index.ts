import { FavoriteModel } from '@margins/db/zod';
import { zod } from '../utils/zod.js';
import { useUser } from '../user.js';
import { useTransaction } from '../utils/transaction.js';

export const create = zod(
	FavoriteModel.omit({
		createdAt: true,
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
	FavoriteModel.pick({
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
