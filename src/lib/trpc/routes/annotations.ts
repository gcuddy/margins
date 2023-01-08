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
        })
})