import { z } from 'zod';
import { SessionOrderByRelevanceFieldEnumSchema } from '../enums/SessionOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SessionOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => SessionOrderByRelevanceFieldEnumSchema),
			z.lazy(() => SessionOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const SessionOrderByRelevanceInputObjectSchema = Schema;
