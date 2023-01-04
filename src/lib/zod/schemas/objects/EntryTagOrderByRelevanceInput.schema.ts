import { z } from 'zod';
import { EntryTagOrderByRelevanceFieldEnumSchema } from '../enums/EntryTagOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => EntryTagOrderByRelevanceFieldEnumSchema),
			z.lazy(() => EntryTagOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const EntryTagOrderByRelevanceInputObjectSchema = Schema;
