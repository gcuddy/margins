import { z } from "zod";

import dayjs from "$lib/dayjs";

import { protectedProcedure, router } from "../t";

export const logRouter = router({
    list: protectedProcedure.query(async ({ ctx }) => {
        const { userId } = ctx;
        const logs = await ctx.prisma.log.findMany({
            where: {
                userId
            },
            orderBy: {
                date: "desc"
            },
            include: {
                entry: {
                    include: {
                        interactions: {
                            where: {
                                userId
                            }
                        }
                    }
                }
            }
        });
        return logs
    }),
    push: protectedProcedure
        .input(z.object({
            entryId: z.number()
        }))
        .mutation(async ({ input, ctx }) => {
            const { userId } = ctx;
            const { entryId } = input;
            // set  date to today
            // check if log exists for today
            // if it does, return
            // if it doesn't, create it
            // this prevents duplicates
            const date = dayjs().startOf("day").toDate();
            const log = await ctx.prisma.log.findUnique({
                where: {
                    userId_entryId_date: {
                        userId,
                        entryId,
                        date
                    }
                }
            });
            if (log) {
                return log;
            }
            return await ctx.prisma.log.create({
                data: {
                    userId,
                    entryId,
                    date
                },
            });
        }),
})
