import ShadeGenerator from "shade-generator";
import { z } from "zod";

import { saveColorDescriptionSchema } from "$lib/prisma/zod-inputs";
import { protectedProcedure, publicProcedure, router } from "$lib/trpc/t";
import { LocationSchema } from "$lib/types/schemas/Locations";

export const userRouter = router({
    getUser: protectedProcedure
        .query(async ({ ctx: { user } }) => {
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        }),
    getTags: protectedProcedure
        .query(async ({ ctx: { db, userId } }) => {
            return db
                .selectFrom("Tag as t")
                .leftJoin("TagOnEntry as te", "te.tagId", "t.id")
                .leftJoin("annotation_tag as at", "at.tagId", "t.id")
                .select(["t.name", "t.id", "te.entryId", "at.annotationId"])
                .where("te.userId", "=", userId)
                .execute();
        }),
    getStates: protectedProcedure
        .query(async ({ ctx: { db, userId } }) => {
            return db
                .selectFrom("State as s")
                .innerJoin("user as u", "u.id", "s.userId")
                .select(["s.name", "s.id", "s.type"])
                .where("u.id", "=", userId)
                .execute();
        }),
    data: protectedProcedure
        .input(
            z
                .object({
                    bookmarks: z.boolean(),
                    stylesheets: z.boolean(),
                    states: z.boolean(),
                    subscriptions: z.boolean(),
                    color_descriptions: z.boolean(),
                    favorites: z.boolean(),
                    tags: z.boolean()
                })
                .partial()
                .optional()
        )
        .query(
            async ({
                ctx: { userId, prisma },
                input = {
                    bookmarks: true,
                    stylesheets: true,
                    states: true,
                    subscriptions: true,
                    color_descriptions: true,
                    favorites: false,
                    tags: true
                },
            }) => {
                const user = await prisma.user.findUniqueOrThrow({
                    where: {
                        id: userId,
                    },
                    select: {
                        username: true,
                        id: true,
                        default_state_id: true,
                        email: true,
                        ...input,
                        // subscriptions: input.subscriptions
                        // 	? {
                        // 		select: {
                        // 			title: true,
                        // 			id: true,
                        // 			feedId: true,
                        // 			feed: {
                        // 				select: {
                        // 					podcast: true,
                        // 					podcastIndexId: true,
                        // 				},
                        // 			},
                        // 			// feed: {
                        // 			//     select: {
                        // 			//         imageUrl: true,
                        // 			//         link: true,
                        // 			//         feedUrl: true,
                        // 			//     },
                        // 			// },
                        // 		},
                        // 	}
                        // 	: undefined,
                        // bookmarks: input.bookmarks
                        // 	? {
                        // 			include: {
                        // 				entry: true,
                        // 			},
                        // 	  }
                        // 	: undefined,
                        // bookmarks: {
                        // 	include: {
                        // 		entry: {
                        // 			select: {
                        // 				id: true,
                        // 				uri: true,
                        // 				podcastIndexId: true,
                        //                 tmdbId: true
                        // 			},
                        // 		},
                        // 	},
                        // },
                    },
                });
                return {
                    ...user,
                    defaultState: user.states?.find((state) => state.id === user.default_state_id),
                };
            }
        ),
    updateStates: protectedProcedure
        .input(
            z.object({
                id: z.number(),
                color: z.string().optional(),
                name: z.string().optional(),
            })
        )
        .query(({ ctx: { userId, prisma }, input: { id, color, name } }) =>
            prisma.state.update({
                where: {
                    id,
                },
                data: {
                    color,
                    name,
                },
            })
        ),
    createState: protectedProcedure
        .input(
            z.object({
                type: LocationSchema,
            })
        )
        .mutation(({ ctx, input }) =>
            ctx.prisma.state.create({
                data: {
                    name: "Untitled",
                    type: input.type,
                    userId: ctx.userId,
                },
            })
        ),
    saveColorDescription: protectedProcedure
        .input(
            saveColorDescriptionSchema
        )
        .mutation(async ({ ctx, input }) => {
            const { color, description } = input;
            const { userId } = ctx;
            return ctx.prisma.colorDescription.upsert({
                where: {
                    userId_color: {
                        userId,
                        color,
                    },
                },
                create: {
                    color,
                    description,
                    userId,
                },
                update: {
                    description,
                },
            });
        }),
    generateColors: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            return ShadeGenerator.hue(input).shadesMap("rgba")
        }),
    listTags: protectedProcedure
        .query(async ({ ctx: { prisma, userId } }) => {
            const tags = await prisma.tag.findMany({
                where: {
                    userId,
                },
                select: {
                    id: true,
                    name: true,

                },
            });
            return tags;
        })
});
