import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SessionCreateManyInput> = z
	.object({
		id: z.string(),
		user_id: z.string(),
		expires: z.bigint(),
		idle_expires: z.bigint(),
	})
	.strict();

export const SessionCreateManyInputObjectSchema = Schema;
