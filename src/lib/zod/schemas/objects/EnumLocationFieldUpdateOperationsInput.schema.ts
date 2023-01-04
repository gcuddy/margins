import { z } from 'zod';
import { LocationSchema } from '../enums/Location.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumLocationFieldUpdateOperationsInput> = z
	.object({
		set: z.lazy(() => LocationSchema).optional(),
	})
	.strict();

export const EnumLocationFieldUpdateOperationsInputObjectSchema = Schema;
