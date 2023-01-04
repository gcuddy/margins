import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z
	.object({
		id: z.string(),
		user_id: z.string(),
		expires: z.bigint(),
		idle_expires: z.bigint(),
	})
	.strict();

export const SessionUncheckedCreateInputObjectSchema = Schema;
