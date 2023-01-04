import { z } from 'zod';
import { TagOrderByRelevanceFieldEnumSchema } from '../enums/TagOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => TagOrderByRelevanceFieldEnumSchema),
			z.lazy(() => TagOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const TagOrderByRelevanceInputObjectSchema = Schema;
