import { z } from 'zod';
import { UserCreateNestedOneWithoutSessionInputObjectSchema } from './UserCreateNestedOneWithoutSessionInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SessionCreateInput> = z
	.object({
		id: z.string(),
		expires: z.bigint(),
		idle_expires: z.bigint(),
		user: z.lazy(() => UserCreateNestedOneWithoutSessionInputObjectSchema),
	})
	.strict();

export const SessionCreateInputObjectSchema = Schema;
