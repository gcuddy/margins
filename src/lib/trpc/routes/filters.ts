import { SmartListCondition } from "$lib/types/filter";
import { ViewOptionsSchema } from "$lib/types/schemas/View";
import { z } from "zod";
import { protectedProcedure, router } from "../t";

export const filterRouter = router({
    save: protectedProcedure
        .input(z.object({
            id: z.number(),
            name: z.string().optional(),
            filter: SmartListCondition.optional(),
            viewOptions: ViewOptionsSchema.optional()
        }).or(z.object({
            name: z.string(),
            id: z.number().optional(),
            filter: SmartListCondition,
            viewOptions: ViewOptionsSchema.optional()
        })))
        .mutation(async ({ ctx, input }) => {
            const { name, id, filter, viewOptions } = input;
            if (id) {
                return ctx.prisma.smartList.update({
                    where: {
                        id
                    },
                    data: {
                        name,
                        filter,
                        viewOptions
                    },

                })
            } else if (name && filter) {
                return ctx.prisma.smartList.create({
                    data: {
                        name,
                        filter,
                        viewOptions
                    }
                })
            }
        })
})