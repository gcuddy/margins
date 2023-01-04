import { z } from 'zod';
import { ContextNodeOrderByRelevanceFieldEnumSchema } from '../enums/ContextNodeOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextNodeOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => ContextNodeOrderByRelevanceFieldEnumSchema),
			z.lazy(() => ContextNodeOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const ContextNodeOrderByRelevanceInputObjectSchema = Schema;
