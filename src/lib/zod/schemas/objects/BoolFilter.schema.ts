import { z } from 'zod';
import { BooleanFieldRefInputObjectSchema } from './BooleanFieldRefInput.schema';
import { NestedBoolFilterObjectSchema } from './NestedBoolFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BoolFilter> = z
	.object({
		equals: z.union([z.boolean(), z.lazy(() => BooleanFieldRefInputObjectSchema)]).optional(),
		not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterObjectSchema)]).optional(),
	})
	.strict();

export const BoolFilterObjectSchema = Schema;
