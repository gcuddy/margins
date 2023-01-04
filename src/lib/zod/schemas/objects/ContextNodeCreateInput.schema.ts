import { z } from 'zod';
import { UserCreateNestedOneWithoutContext_nodesInputObjectSchema } from './UserCreateNestedOneWithoutContext_nodesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextNodeCreateInput> = z
	.object({
		id: z.string().optional(),
		name: z.string(),
		url: z.string().optional().nullable(),
		description: z.string().optional().nullable(),
		owner: z.lazy(() => UserCreateNestedOneWithoutContext_nodesInputObjectSchema),
		refers_to: z.string().optional().nullable(),
	})
	.strict();

export const ContextNodeCreateInputObjectSchema = Schema;
