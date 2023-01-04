import { z } from 'zod';

import { normalizeUrl } from '$lib/feeds/utils';
import parse from '$lib/parse';
import { publicProcedure, router } from '$lib/trpc/t';

export const publicRouter = router({
	parse: publicProcedure
		.input(z.string())
		.query(async ({ input }) => {
			const normalizedUrl = normalizeUrl(input);
			return parse(normalizedUrl)
		}),
	loadEntry: publicProcedure.input(z.object({
		id: z.number()
	})).query(async ({ ctx, input }) => {
		const { id } = input;
		const entry = await ctx.prisma.entry.findUniqueOrThrow({
			where: {
				id
			}
		})
		return entry;
	})
});
