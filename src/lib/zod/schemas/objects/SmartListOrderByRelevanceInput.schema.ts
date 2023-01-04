import { z } from 'zod';
import { SmartListOrderByRelevanceFieldEnumSchema } from '../enums/SmartListOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SmartListOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => SmartListOrderByRelevanceFieldEnumSchema),
			z.lazy(() => SmartListOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const SmartListOrderByRelevanceInputObjectSchema = Schema;
