import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

import { db } from '$lib/db';

import type { RequestHandler } from './$types';

const PatchSchema = z.object({
	ids: z.number().array(),
	data: z
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
		.partial(),
});

export const PATCH: RequestHandler = async ({ request, locals }) => {
	try {
		const session = await locals.validate();
		if (!session) {
			throw error(401, 'unauthorized');
		}

		const data = await request.json();
		const parsed = PatchSchema.parse(data);
		// const parsed = Prisma.validator<Prisma.AnnotationUpdateManyArgs>()({
		//     where
		// })

		// TODO: test timing of updateMany vs db.transaction

		const updated = await db.annotation.updateMany({
			where: {
				OR: parsed.ids.map((id) => {
					return {
						id,
					};
				}),
			},
			data: parsed.data,
		});
		// const articles = await db.$transaction(
		// 	parsed.ids.map((id) => {
		// 		return db.article.update({
		// 			where: {
		// 				id: Number(id),
		// 			},
		// 			data: parsed.data,
		// 		});
		// 	})
		// );
		// does it need to return anything?
		return json(updated);
	} catch (e) {
		console.error(e);
		throw error(500);
		// return json$1(
		// 	{
		// 		error: reportZodOrPrismaError(e),
		// 	},
		// 	{
		// 		status: 400,
		// 	}
		// );
	}
};
