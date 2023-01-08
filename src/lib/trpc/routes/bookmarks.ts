import { db } from '$lib/db';
import { auth } from '$lib/trpc/middleware/auth';
import { logger } from '$lib/trpc/middleware/logger';
import { z } from 'zod';
import { protectedProcedure, router } from '$lib/trpc/t';
import { Metadata } from '$lib/web-parser';
import dayjs from 'dayjs';





export const bookmarks = router({
	add: protectedProcedure
		.input(
			z.object({
				url: z.string().optional(),
				entryId: z.number().optional(),
				article: Metadata.extend({
					html: z.string().optional(),
					text: z.string().optional(),
					wordCount: z.number().optional(),
				}).optional(),
				tags: z.object({ name: z.string(), id: z.number().optional() }).array().optional(),
				note: z.string().optional(),
				context: z.object({
					url: z.string().optional(),
					entryId: z.number().optional()
				}).optional(),
				stateId: z.number().optional()
			}).refine(data => !!data.url || !!data.entryId, "Need either URL or entryId")
		)
		.mutation(({ input, ctx }) =>
			db.bookmark.upsert({
				where: {
					uri: !input.entryId ? input.url : undefined,
					entryId: input.entryId
				},
				create: {
					// save own copy?
					// data: input.article,
					entry: {
						connectOrCreate: {
							where: {
								uri: !input.entryId ? input.url : undefined,
								id: input.entryId
							},
							create: {
								...input.article,
								published: input.article ? dayjs(input.article.published).toDate() : undefined,
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
					context: input.context,
					state: input.stateId ? {
						connect: {
							id: input.stateId
						}
					} : {
						connect: {
							// TODO: this should not be nullable
							id: ctx.user?.default_state_id
						}
					}
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
	getContext: protectedProcedure
		.input(
			z.object({
				id: z.number()
			})
		).query(({ input: { id }, ctx: { userId } }) => db.bookmark.findUniqueOrThrow({
			where: {
				id,
				userId
			},
			select: {
				context: true
			}
		})),
	byEntry: protectedProcedure.input(z.object({
		entryId: z.number()
	})).query(async ({ ctx, input }) => {
		const { entryId } = input;
		const bookmark = await ctx.prisma.bookmark.findFirst({
			where: {
				entryId
			}
		});
		return bookmark;
	}),
	archive: protectedProcedure
		.input(z.number())
		.mutation(async ({ ctx, input }) => {
			// REVIEW: this gets the "first" archive state. this is what we want, right?
			const stateId = ctx.user?.states.find(s => s.type === "archive")?.id
			return ctx.prisma.bookmark.update({
				where: {
					id: input
				},
				data: {
					stateId
				}
			})
		}),
	updateState: protectedProcedure.input(z.object({
		stateId: z.number(),
		id: z.number().nullish(),
		entryId: z.number()
	})).mutation(async ({ ctx, input }) => {
		const { stateId, id, entryId } = input;
		const { userId } = ctx;
		console.log({ stateId, id })
		if (id) {
			// update
			return ctx.prisma.bookmark.update({
				where: {
					id,
					userId
				},
				data: {
					stateId
				}
			});
		} else {
			return ctx.prisma.bookmark.upsert({
				where: {
					entryId,
					userId
				},
				create: {
					stateId,
					entryId,
					userId
				},
				update: {
					stateId
				}
			})
			// create
		}
		// console.log({ bookmark })
		// return {
		// 	success: true
		// }
	}),
	updateStates: protectedProcedure.input(z.object({
		stateId: z.number(),
		ids: z.object({
			bookmark: z.number().optional(),
			entry: z.number()
		})
	})).mutation(async ({ ctx, input }) => {
		const { stateId } = input;
		// TODO:
		// ctx.prisma.bookmark.updateMany({
		// 	where: {

		// 	}
		// })
		// console.log({ stateId, id })
		// if (id) {
		// 	// update
		// 	return ctx.prisma.bookmark.update({
		// 		where: {
		// 			id
		// 		},
		// 		data: {
		// 			stateId
		// 		}
		// 	});
		// } else {
		// 	return ctx.prisma.bookmark.create({
		// 		data: {
		// 			stateId,
		// 			entryId,
		// 			userId: ctx.userId
		// 		}
		// 	})
		// 	// create
		// }
	}),
});
