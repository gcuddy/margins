import { z } from 'zod';

import { db } from '$lib/db';
import { auth } from '$lib/trpc/middleware/auth';
import { protectedProcedure, router } from '$lib/trpc/t';

import { logger } from '../middleware/logger';
import { Metadata } from '$lib/web-parser';

const idInput = z.object({
	id: z.number(),
});

export const entries = router({
	list: protectedProcedure
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
									// type: 'note',
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
							bookmarks: {
								where: {
									userId
								},
								include: {
									state: true
								}
							}
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
					.then((entries) => entries.map((e) => {
						const { bookmarks, ...entry } = e
						return { ...entry, bookmark: bookmarks[0] }
					}))
			// .then((books) => books.map((book) => ({ ...book, price: book.price.toJSON() })))
		),
	load: protectedProcedure
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
				context: {
					where: {
						userId
					},
				},
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
					},
					include: {
						state: true
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
			const { data, interactions, bookmarks, ...finalEntry } = entry
			const bookmark = entry.bookmarks[0];
			const context = entry.bookmarks[0]?.context;
			const progress = interactions[0]?.progress;
			const unread = !interactions[0]?.is_read;
			return {
				...finalEntry,
				bookmark,
				html,
				context,
				custom: !!entry.data.length,
				progress,
				unread,
			}
		})
		),
	loadData: protectedProcedure
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
	getAnnotations: protectedProcedure
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
	addData: protectedProcedure
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
		),
	markAsRead: protectedProcedure
		.input(z.object({
			id: z.number(),
		}))
		.mutation(({ ctx: { userId }, input: { id } }) => db.interaction.upsert({
			where: {
				userId_entryId: {
					userId,
					entryId: id
				}
			},
			create: {
				is_read: true,
				user: {
					connect: {
						id: userId
					}
				},
				entry: {
					connect: {
						id
					}
				}
			},
			update: {
				is_read: true

			}
		})),
	updateInteraction: protectedProcedure
		.input(z.object({
			id: z.number(),
			progress: z.number(),
			is_read: z.boolean()
		}))
		.mutation(({ ctx: { userId }, input: { id, progress, is_read } }) => db.entry.update({
			where: {
				id
			},
			data: {
				interactions: {
					upsert: {
						where: {
							userId_entryId: {
								userId,
								entryId: id
							}
						},
						create: {
							progress,
							is_read,
							user: {
								connect: {
									id: userId
								}
							}
						},
						update: {
							progress,
							is_read
						}
					}
				}
			}
		})),
	byFeed: protectedProcedure.input(
		z.object({
			id: z.number()
		})
	).query(({ ctx, input }) => {
		const { id } = input;
		return ctx.prisma.entry.findMany({
			where: {
				feedId: id
			}
		})
	}),
	byFeeds: protectedProcedure
		.input(z.object({
			ids: z.number().array()
		}))
		.query(async ({ ctx, input }) => {
			const { ids } = input;
			const entries = await ctx.prisma.entry.findMany({
				where: {
					feedId: {
						in: ids
					}
				}
			});
			return entries;
		}),
	listForUserSubscriptions: protectedProcedure.query(async ({ ctx }) => {
		const { prisma, userId } = ctx;
		const feedWithEntries = await ctx.prisma.feed.findMany({
			where: {
				subscriptions: {
					some: {
						userId
					}
				}
			},
			select: {
				entries: true
			}
		});
		return feedWithEntries.flatMap(f => f.entries)
	})
});
