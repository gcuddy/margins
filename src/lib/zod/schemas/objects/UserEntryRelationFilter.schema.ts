import { z } from 'zod';
import { UserEntryWhereInputObjectSchema } from './UserEntryWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryRelationFilter> = z
	.object({
		is: z
			.lazy(() => UserEntryWhereInputObjectSchema)
			.optional()
			.nullable(),
		isNot: z
			.lazy(() => UserEntryWhereInputObjectSchema)
			.optional()
			.nullable(),
	})
	.strict();

export const UserEntryRelationFilterObjectSchema = Schema;
