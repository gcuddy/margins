import { z } from 'zod';
import { CollectionOrderByRelevanceFieldEnumSchema } from '../enums/CollectionOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => CollectionOrderByRelevanceFieldEnumSchema),
			z.lazy(() => CollectionOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const CollectionOrderByRelevanceInputObjectSchema = Schema;
