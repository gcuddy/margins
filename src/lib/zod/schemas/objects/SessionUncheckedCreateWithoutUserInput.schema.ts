import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> = z
	.object({
		id: z.string(),
		expires: z.bigint(),
		idle_expires: z.bigint(),
	})
	.strict();

export const SessionUncheckedCreateWithoutUserInputObjectSchema = Schema;
