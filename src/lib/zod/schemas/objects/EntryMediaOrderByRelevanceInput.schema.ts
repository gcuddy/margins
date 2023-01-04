import { z } from 'zod';
import { EntryMediaOrderByRelevanceFieldEnumSchema } from '../enums/EntryMediaOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => EntryMediaOrderByRelevanceFieldEnumSchema),
			z.lazy(() => EntryMediaOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const EntryMediaOrderByRelevanceInputObjectSchema = Schema;
