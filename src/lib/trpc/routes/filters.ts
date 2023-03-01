import { z } from "zod";

import { SmartListCondition } from "$lib/types/filter";
import { chosenIcon } from "$lib/types/icon";
import { ViewOptionsSchema } from "$lib/types/schemas/View";

import { protectedProcedure, router } from "../t";

export const filterRouter = router({
    save: protectedProcedure
        .input(
            // TODO: type this
            z
                .object({
                    id: z.number(),
                    icon: chosenIcon.optional(),
                    name: z.string().optional(),
                    filter: SmartListCondition.optional(),
                    conditions: z.any(),
                    viewOptions: ViewOptionsSchema.optional(),
                })
                .or(
                    z.object({
                        name: z.string(),
                        icon: chosenIcon.optional(),
                        id: z.number().optional(),
                        filter: SmartListCondition.or(z.any()),
                        conditions: z.any(),
                        viewOptions: ViewOptionsSchema.optional(),
                    })
                )
        )
        .mutation(async ({ ctx, input }) => {
            const { name, id, filter, conditions, viewOptions, icon } = input;
            const { userId } = ctx;
            console.log({ name, id, filter });
            if (id) {
                return await ctx.prisma.smartList.update({
                    where: {
                        id,
                        userId,
                    },
                    data: {
                        name,
                        filter,
                        conditions,
                        viewOptions,
                        icon
                    },
                });
            } else if (name && filter) {
                console.log("creating new smart list", input)
                const smartList = await ctx.prisma.smartList.create({
                    data: {
                        name,
                        filter,
                        viewOptions,
                        conditions,
                        userId,
                        icon
                    },
                });
                return smartList;
            }
        }),
    entries: protectedProcedure
        // TODO: type better....
        .input(
            z.object({
                where: z.object({}),
            })
        )
        .query(async ({ ctx, input }) => {
            const { prisma } = ctx;
            const { where } = input;
            // TODO: make infinite query
            const entries = await ctx.prisma.entry.findMany({
                where,
            });
            return entries;
        }),
});
