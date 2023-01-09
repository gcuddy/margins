import { z } from 'zod';

import { db } from '$lib/db';
import { protectedProcedure, publicProcedure, router } from '$lib/trpc/t';

import { LocationSchema } from '$lib/types/schemas/Locations';
import { Metadata } from '$lib/web-parser';
// import { EntryWhereInputObjectSchema } from '$lib/zod/schemas';

const idInput = z.object({
	id: z.number(),
});

export const entries = router({
	listBookmarks: protectedProcedure
		.input(z.object({
			location: LocationSchema.or(z.literal("all")),
			stateId: z.number().optional()
		}).optional())
		.query(
			async ({ ctx, input }) => {
				const { userId, user } = ctx;
				let stateIds: number[] | undefined = undefined;
				if (input?.location && input.location !== "all") {
					stateIds = user?.states.filter(s => s.type === input.location).map(s => s.id)
				}
				console.log({ stateIds })
				const entries = await ctx.prisma.entry
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
									userId,
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
									stateId: stateIds ? {
										in: stateIds
									} : undefined
								},
							},
						},
						take: 20,
					})
					.then((entries) => entries.map((e) => {
						const { bookmarks, ...entry } = e
						return { ...entry, bookmark: bookmarks[0] }
					}))
				return entries
			}
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
				annotations: {
					include: {
						creator: {
							select: {
								username: true
							}
						},
					}
				},
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
	byFeed: protectedProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ ctx, input }) => {
			const entries = await ctx.prisma.entry.findMany({
				where: {
					feedId: input.id
				},
				orderBy: [{
					published: 'desc'
				}]
			})
			return { entries }
		}),
	byFeed2: protectedProcedure.input(
		z.object({
			id: z.number(),
			// limit: z.number().min(1).max(100).nullish(),
			// cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type		
		})
	).query(async ({ ctx, input }) => {
		console.log({ ctx })
		return {
			entries: []
		}
		console.log(`[BYFEED]`, ctx, input)
		// const limit = input.limit ?? 50;
		const { id } = input;
		const entries = await ctx.prisma.entry.findMany({
			take: 25,
			where: {
				feedId: id
			},
			// cursor: cursor ? { id: cursor } : undefined,
			orderBy: {
				published: 'desc'
			}
		});
		// let nextCursor: typeof cursor | undefined = undefined;
		// if (entries.length > limit) {
		// 	const nextItem = entries.pop()
		// 	nextCursor = nextItem!.id;
		// }
		return {
			entries,
			// nextCursor
		}
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
				},
			},
			select: {
				entries: true
			},
			take: 10
		});
		return feedWithEntries.flatMap(f => f.entries)
	}),
	filter: protectedProcedure
		.input(z.object({
			name: z.string()
		}))
		.query(async ({ ctx, input }) => {
			const { userId } = ctx;
			// REVIEW: Is this protected? Should we filter by where it exists in a user's bookmarks or their subscriptions?
			// (That might be a heavy query)
			const entries = ctx.prisma.entry.findMany({
				where: {
					...input,
					OR: [
						{
							bookmarks: {
								some: {
									userId
								}
							}
						},
						{
							feed: {
								subscriptions: {
									some: {
										userId
									}
								}
							}
						}
					]
				}
			})
			return entries;
		}),
	byTag: protectedProcedure
		.input(z.object({
			tag: z.string(),
			// username: z.string(),
			/// Whether or not to just return bookmarks
			boookmarks: z.boolean().default(false)
		}))
		.query(async ({ ctx, input }) => {
			const { tag } = input;
			// REVIEW: I think that the querying username thing from a public perspective should go in public router
			// const authed = ctx.user?.username === username;
			const entries = await ctx.prisma.entry.findMany({
				where: {
					tags: {
						some: {
							name: tag,
							userId: ctx.userId
						}
					}
				}
			})
		}),
	search: protectedProcedure
		.input(z.string())
		.query(async ({ ctx, input: search }) => {
			const { userId } = ctx;

			return ctx.prisma.entry.findMany({
				where: {
					text: {
						search
					},
					title: {
						search
					},
					// REVIEW: where bookmark or feed related — is this what we want?
					OR: [
						{
							bookmarks: {
								some: {
									userId
								}
							},
						},
						{
							feed: {
								// REVIEW: should context get user.subscriptions instead of nested query here?
								subscriptions: {
									some: {
										userId
									}
								}
							}
						}

					]
				},
			})
		}),
	delete: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
		return ctx.prisma.entry.delete({
			where: {
				id: input,
			}
		})
	})
});
