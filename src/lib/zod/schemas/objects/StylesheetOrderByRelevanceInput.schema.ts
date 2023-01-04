import { z } from 'zod';
import { StylesheetOrderByRelevanceFieldEnumSchema } from '../enums/StylesheetOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => StylesheetOrderByRelevanceFieldEnumSchema),
			z.lazy(() => StylesheetOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const StylesheetOrderByRelevanceInputObjectSchema = Schema;
