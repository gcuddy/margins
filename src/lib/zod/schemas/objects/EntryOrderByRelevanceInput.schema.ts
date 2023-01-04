import { z } from 'zod';
import { EntryOrderByRelevanceFieldEnumSchema } from '../enums/EntryOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => EntryOrderByRelevanceFieldEnumSchema),
			z.lazy(() => EntryOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const EntryOrderByRelevanceInputObjectSchema = Schema;
