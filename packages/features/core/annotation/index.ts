import { zod } from '../utils/zod.js';
import { AnnotationModel } from '@margins/db/zod';
import { useUser } from '../user.js';
import { useTransaction } from '../utils/transaction.js';

export const create = zod(
	AnnotationModel.pick({
		body: true,
		entryId: true,
		id: true,
	}),
	async (input) => {
		return useTransaction(async (db) => {
			await db
				.insertInto('Annotation')
				.values({
					...input,
					userId: useUser().id,
				})
				.executeTakeFirst();
		});
	},
);
