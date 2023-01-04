import { z } from 'zod';
import { LocationSchema } from '../enums/Location.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.NullableEnumLocationFieldUpdateOperationsInput> = z
	.object({
		set: z
			.lazy(() => LocationSchema)
			.optional()
			.nullable(),
	})
	.strict();

export const NullableEnumLocationFieldUpdateOperationsInputObjectSchema = Schema;
