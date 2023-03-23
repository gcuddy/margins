import { RootFavorite, rootFavoriteSelect } from "$lib/prisma/selects/favorite";
import { z } from "zod";
import { protectedProcedure, router } from "../t";

export const favoritesRouter = router({
	create: protectedProcedure
		.input(
			z.object({
				id: z.string().optional(),
				folderName: z.string().optional(),
				sortOrder: z.number(),
				entryId: z.number().optional(),
				tagId: z.number().optional(),
				annotationId: z.number().optional(),
				collectionId: z.number().optional(),
				smartListId: z.number().optional(),
				children: z.array(z.string()).optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { id, folderName, sortOrder, entryId, tagId, annotationId, collectionId, children, smartListId } =
				input;
			console.log({ smartListId });
			const { userId } = ctx;
			if (folderName) {
				const folder = await ctx.prisma.favorite.create({
					data: {
						userId,
						folderName,
						sortOrder,
						id,
						type: "FOLDER",
					},
					include: {
						children: true,
					},
				});
				return folder;
			} else {
				// TODO
				const favorite = await ctx.prisma.favorite.create({
					data: {
						userId,
						entryId,
						tagId,
						annotationId,
						smartListId,
						collectionId,
						sortOrder,
						children: children
							? {
								connect: children.map((id) => ({ id })),
							}
							: undefined,
					},
					include: {
						// return what was passed in
						entry: entryId
							? {
								select: {
									id: true,
									title: true,
									type: true,
								},
							}
							: undefined,
						tag: tagId ? true : undefined,
						annotation: annotationId ? true : undefined,
						collection: collectionId ? true : undefined,
						smartList: smartListId ? true : undefined,
					},
				});
				return favorite;
			}
			// const folder = await ctx.prisma.favoriteFolder.create({
			// 	data: {
			// 		userId,
			// 		folderName,
			// 		sortOrder,
			// 	},
			// });
		}),
	favorite: protectedProcedure
		.input(
			z
				.object({
					entryId: z.number(),
					tagId: z.number(),
					annotationId: z.number(),
				})
				.partial()
		)
		.mutation(async ({ input, ctx }) => {
			const { userId } = ctx;
			const { entryId } = input;
			return await ctx.prisma.favorite.create({
				data: {
					userId,
					entryId,
				},
			});
		}),
	unfavorite: protectedProcedure
		.input(
			z.object({
				entryId: z.number(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { userId } = ctx;
			const { entryId } = input;
			return await ctx.prisma.favorite.delete({
				where: {
					userId_entryId: {
						userId,
						entryId,
					},
				},
			});
		}),
	toggle: protectedProcedure
		.input(
			z.object({
				entryId: z.number(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { userId } = ctx;
			const { entryId } = input;
			const favorite = await ctx.prisma.favorite.findUnique({
				where: {
					userId_entryId: {
						userId,
						entryId,
					},
				},
			});
			if (favorite) {
				return await ctx.prisma.favorite.delete({
					where: {
						userId_entryId: {
							userId,
							entryId,
						},
					},
				});
			} else {
				return await ctx.prisma.favorite.create({
					data: {
						userId,
						entryId,
					},
				});
			}
		}),
	list: protectedProcedure
		.query(async ({ ctx: { userId, prisma, db } }) => {
            const favorites = db
                .selectFrom("Favorite as f")
                .leftJoin("Entry as e", "f.entryId", "e.id")
                .leftJoin("Tag as t", "f.tagId", "t.id")
                // .leftJoin("Annotation as a", "f.annotationId", "a.id")
                .leftJoin("Collection as c", "f.collectionId", "c.id")
                .leftJoin("SmartList as v", "f.smartListId", "v.id")
                .select([
                    "f.type as type",
                    "f.sortOrder as sortOrder",
                    "f.id as id",
                    "f.folderName as folderName",
                    "e.id as entry_id",
                    "e.title as entry_title",
                    "e.type as entry_type",
                    "t.id as tag_id",
                    "t.name as tag_name",
                    // "a.id as annotation_id",
                    // "a.title as annotation_title",
                    "c.id as collection_id",
                    "c.name as collection_name",
                    "v.id as view_id",
                    "v.name as view_name",
                ])
                .where("f.userId", "=", userId)
                .where("f.parentId", "is", null)
                .orderBy("f.sortOrder", "asc")
                .orderBy("f.createdAt", "asc")
                .execute();
			return favorites;
		}),
	update: protectedProcedure
		.input(
			z
				.object({
					id: z.string(),
					sortOrder: z.number().optional(),
					parent: z.string().optional()
				})
				.or(
					z
						.object({
							id: z.string(),
							sortOrder: z.number().optional(),
							parent: z.string().optional()
						})
						.array()
				)
		)
		.mutation(async ({ input, ctx }) => {
			if (Array.isArray(input)) {
				return await ctx.prisma.$transaction(
					input.map(({ id, sortOrder, parent }) =>
						ctx.prisma.favorite.update({
							where: {
								id,
							},
							data: {
								sortOrder,
								parent: parent ? {
									connect: {
										id: parent
									}
								} : undefined
							},
						})
					)
				);
			} else {
				const { id, sortOrder, parent } = input;
				return await ctx.prisma.favorite.update({
					where: {
						id,
					},
					data: {
						sortOrder,
						parent: parent ? {
							connect: {
								id: parent
							}
						} : undefined
					},
				});
			}
		}),
});
