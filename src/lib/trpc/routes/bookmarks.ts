import { db } from '$lib/db';
import { auth } from '$lib/trpc/middleware/auth';
import { logger } from '$lib/trpc/middleware/logger';
import { z } from 'zod';
import { t } from '$lib/trpc/t';
import { Metadata } from '$lib/web-parser';

export const bookmarks = t.router({
	add: t.procedure
		.use(auth)
		.use(logger)
		.input(
			z.object({
				url: z.string(),
				article: Metadata.extend({
					html: z.string().optional(),
					wordCount: z.number().optional(),
				}),
				tags: z.object({ name: z.string(), id: z.number().optional() }).array().optional(),
				note: z.string().optional(),
			})
		)
		.mutation(({ input, ctx }) =>
			db.bookmark.upsert({
				where: {
					uri: input.url,
				},
				create: {
					// save own copy?
					// data: input.article,
					entry: {
						connectOrCreate: {
							where: {
								uri: input.url,
							},
							create: {
								...input.article,
								type: 'article',
								uri: input.url,
							},
						},
					},
					// interaction: {}
					// tags: input.tags
					// 	? {
					// 			connectOrCreate: connectOrCreateTaggings({
					// 				tags: input.tags,
					// 				userId: ctx.userId,
					// 			}),
					// 	  }
					// 	: undefined,
					annotations: {
						create: {
							type: "note",
							body: input.note,
							userId: ctx.userId
						}
					},
					user: {
						connect: {
							id: ctx.userId,
						},
					},
					// state: {
					//     connect: {
					//     }
					// }
				},
				update: {
					// TODO
				}
			})
		),
});
