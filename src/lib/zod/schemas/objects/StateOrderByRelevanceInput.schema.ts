import { z } from 'zod';
import { StateOrderByRelevanceFieldEnumSchema } from '../enums/StateOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => StateOrderByRelevanceFieldEnumSchema),
			z.lazy(() => StateOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const StateOrderByRelevanceInputObjectSchema = Schema;
