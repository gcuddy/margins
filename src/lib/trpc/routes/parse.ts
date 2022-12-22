import { z } from 'zod';

import { normalizeUrl } from '$lib/feeds/utils';
import parse from '$lib/parse';
import { t } from '$lib/trpc/t';

import { logger } from '../middleware/logger';

export const parser = t.router({
	parse: t.procedure
		.use(logger)
		.input(z.string())
		.query(async ({ input }) => {
			const normalizedUrl = normalizeUrl(input);
			return parse(normalizedUrl);
		}),
});
