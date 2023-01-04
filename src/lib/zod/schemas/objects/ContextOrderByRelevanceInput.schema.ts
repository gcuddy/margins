import { z } from 'zod';
import { ContextOrderByRelevanceFieldEnumSchema } from '../enums/ContextOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => ContextOrderByRelevanceFieldEnumSchema),
			z.lazy(() => ContextOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const ContextOrderByRelevanceInputObjectSchema = Schema;
