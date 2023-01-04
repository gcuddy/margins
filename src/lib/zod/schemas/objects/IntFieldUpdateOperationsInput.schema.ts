import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z
	.object({
		set: z.number().optional(),
		increment: z.number().optional(),
		decrement: z.number().optional(),
		multiply: z.number().optional(),
		divide: z.number().optional(),
	})
	.strict();

export const IntFieldUpdateOperationsInputObjectSchema = Schema;
