import { z } from 'zod';
import { SmartListWhereInputObjectSchema } from './SmartListWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SmartListRelationFilter> = z
	.object({
		is: z
			.lazy(() => SmartListWhereInputObjectSchema)
			.optional()
			.nullable(),
		isNot: z
			.lazy(() => SmartListWhereInputObjectSchema)
			.optional()
			.nullable(),
	})
	.strict();

export const SmartListRelationFilterObjectSchema = Schema;
