import { z } from 'zod';
import { EntryDataOrderByRelevanceFieldEnumSchema } from '../enums/EntryDataOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => EntryDataOrderByRelevanceFieldEnumSchema),
			z.lazy(() => EntryDataOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const EntryDataOrderByRelevanceInputObjectSchema = Schema;
