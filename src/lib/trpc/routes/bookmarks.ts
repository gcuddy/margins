import { z } from 'zod';

import { db } from '$lib/db';
import { connectOrCreateTaggings } from '$lib/tag.server';
import { auth } from '$lib/trpc/middleware/auth';
import { t } from '$lib/trpc/t';
import { Metadata } from '$lib/web-parser';

import { logger } from '../middleware/logger';
const idInput = z.object({
	id: z.number(),
});

export const bookmarkRouter = t.router({
	add: t.procedure
		.use(auth)
		.use(logger)
		.input(
			z.object({
				url: z.string(),
				article: Metadata.extend({
					html: z.string(),
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
					tags: input.tags
						? {
								connectOrCreate: connectOrCreateTaggings({
									tags: input.tags,
									userId: ctx.userId,
								}),
						  }
						: undefined,
					annotations: input.note
						? {
								create: {
									type: 'note',
									userId: ctx.userId,
									body: input.note,
								},
						  }
						: undefined,
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
			})
		),
});
