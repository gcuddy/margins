import { db } from '@margins/db';
import { zod } from '../utils/zod.js';
import { AnnotationModel } from '@margins/db/zod';
import { useUser } from '../user.js';

export const create = zod(
	AnnotationModel.pick({
		body: true,
		entryId: true,
		id: true,
	}),
	async (input) => {
		const annotation = await db
			.insertInto('Annotation')
			.values({
				...input,
				userId: useUser().id,
			})
			.executeTakeFirst();

		return annotation;
	},
);
