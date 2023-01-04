import { z } from 'zod';
import { TaggingOrderByRelevanceFieldEnumSchema } from '../enums/TaggingOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => TaggingOrderByRelevanceFieldEnumSchema),
			z.lazy(() => TaggingOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const TaggingOrderByRelevanceInputObjectSchema = Schema;
