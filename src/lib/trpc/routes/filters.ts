import { z } from "zod";

import { SmartListCondition } from "$lib/types/filter";
import { ViewOptionsSchema } from "$lib/types/schemas/View";

import { protectedProcedure, router } from "../t";

export const filterRouter = router({
	save: protectedProcedure
		.input(
			// TODO: type this
			z
				.object({
					id: z.number(),
					name: z.string().optional(),
					filter: SmartListCondition.optional(),
					conditions: z.any(),
					viewOptions: ViewOptionsSchema.optional(),
				})
				.or(
					z.object({
						name: z.string(),
						id: z.number().optional(),
						filter: SmartListCondition.or(z.any()),
						conditions: z.any(),
						viewOptions: ViewOptionsSchema.optional(),
					})
				)
		)
		.mutation(async ({ ctx, input }) => {
			const { name, id, filter, conditions, viewOptions } = input;
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
