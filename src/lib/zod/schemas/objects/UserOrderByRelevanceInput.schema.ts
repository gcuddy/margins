import { z } from 'zod';
import { UserOrderByRelevanceFieldEnumSchema } from '../enums/UserOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => UserOrderByRelevanceFieldEnumSchema),
			z.lazy(() => UserOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const UserOrderByRelevanceInputObjectSchema = Schema;
