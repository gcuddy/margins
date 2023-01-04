import { z } from 'zod';
import { InteractionOrderByRelevanceFieldEnumSchema } from '../enums/InteractionOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => InteractionOrderByRelevanceFieldEnumSchema),
			z.lazy(() => InteractionOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const InteractionOrderByRelevanceInputObjectSchema = Schema;
