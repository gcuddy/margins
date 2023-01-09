import { z } from "zod";
import { protectedProcedure, router } from "../t";

export const annotationRouter = router({
    search: protectedProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            // REVIEW: how to handle Json and full text search?
            // or: should Body just be a string?
            // [path]?
            const { userId } = ctx;
            const annotations = ctx.prisma.annotation.findMany({
                where: {
                    // REVIEW: while this works, it seems probably not efficient? maybe okay if annotations are short
                    body: {
                        string_contains: input
                    },
                    userId
                }
            })
            return annotations;
        }),
    // save: protectedProcedure
    //     .input(z.object({
    //         // TODo
    //     }))
    // ,
    note: protectedProcedure
        .input(z.object({
            entryId: z.number(),
            body: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const { entryId, body } = input;
            const { userId } = ctx;
            const annotation = await ctx.prisma.annotation.create({
                data: {
                    entryId,
                    type: "note",
                    userId,
                    body
                },
            })
            return annotation
        }),
    delete: protectedProcedure
        .input(z.number().or(z.array(z.number())))
        .mutation(async ({ ctx, input }) => {
            if (Array.isArray(input)) {
                const deleted = await ctx.prisma.annotation.deleteMany({
                    where: {
                        id: {
                            in: input
                        }
                    }
                })
                return deleted;
            } else {
                const deleted = await ctx.prisma.annotation.delete({
                    where: {
                        id: input
                    }
                })
                return deleted;
            }
        })
})