import { z } from 'zod';

import { db } from '$lib/db';
import { auth } from '$lib/trpc/middleware/auth';
import { t } from '$lib/trpc/t';

import { logger } from '../middleware/logger';
import { Metadata } from '$lib/web-parser';

const idInput = z.object({
	id: z.number(),
});

export const entries = t.router({
	list: t.procedure
		.use(auth)
		.use(logger)
		.query(
			({ ctx: { userId } }) =>
				db.entry
					.findMany({
						select: {
							id: true,
							title: true,
							author: true,
							// html: true,
							image: true,
							uri: true,
							summary: true,
							updatedAt: true,
							annotations: {
								where: {
									type: 'note',
									userId
								},
							},
							tags: {
								select: {
									id: true,
								},
							},
							_count: {
								select: { annotations: true },
							},
						},
						orderBy: { updatedAt: 'desc' },
						where: {
							bookmarks: {
								some: {
									userId,
								},
							},
						},
						take: 20,
					})
					.then((entries) => entries.map((entry) => ({ ...entry, bookmark: true })))
			// .then((books) => books.map((book) => ({ ...book, price: book.price.toJSON() })))
		),
	load: t.procedure
		.use(auth)
		.use(logger)
		.input(z.object({
			id: z.number()
		}))
		.query(({ ctx: { userId }, input: { id } }) => db.entry.findUniqueOrThrow({
			where: {
				id
			},
			select: {
				title: true,
				html: true,
				author: true,
				id: true,
				feedId: true,
				published: true,
				context: true,
				data: {
					where: {
						userId
					},
					select: {
						html: true
					}
				},
				uri: true,
				bookmarks: {
					where: {
						userId
					}
				},
				tags: true,
				annotations: true,
				interactions: {
					where: {
						userId
					}
				}
			},
		}).then(entry => {
			const html = entry.data[0]?.html || entry.html;
			const { data, ...finalEntry } = entry
			const context = entry.bookmarks[0]?.context
			return {
				...finalEntry,
				html,
				context,
				custom: !!entry.data.length
			}
		})
		),
	loadData: t.procedure
		.use(auth)
		.use(logger)
		.input(
			idInput.extend({
				// todo: maybe this shuold be select instead for prisma ergonomics
				data: z
					.object({
						annotations: z.boolean(),
						content: z.boolean(),
						context: z.boolean().optional()
					})
					.partial(),
			})
		)
		.query(({ ctx, input: { id, data } }) =>
			db.entry
				.findUniqueOrThrow({
					where: {
						id,
					},
					select: {
						annotations: data.annotations,
						context: data.context || false,
						html: data.content,
						data: data.content ? {
							where: {
								userId: ctx.userId,
							}
						} : undefined
					},
					// todo: allow no select to be passed in to get everything
				})
				.then((data) => {
					console.log({ data })
					const entryData = data.data[0] //should be only one per user
					return {
						html: data.html,
						annotations: data.annotations,
						data: entryData,
						context: data.context
					};
				})
		),
	getAnnotations: t.procedure
		.use(auth)
		.use(logger)
		.input(idInput)
		.query(({ input: { id } }) =>
			db.entry
				.findUniqueOrThrow({
					where: {
						id,
					},
					select: {
						annotations: true,
					},
				})
				.then((data) => data.annotations)
		),
	addData: t.procedure
		.use(auth)
		.use(logger)
		.input(z.object({
			id: z.number(),
			article: Metadata.extend({
				html: z.string().optional()
			})
		})).mutation(({ ctx, input }) => db.entryData.upsert({
			where: {
				entryId_userId: {
					entryId: input.id,
					userId: ctx.userId
				}
			},
			create: {
				entryId: input.id,
				userId: ctx.userId,
				html: input.article.html,
			},
			update: {
				html: input.article.html
			}
		})
		)
});
