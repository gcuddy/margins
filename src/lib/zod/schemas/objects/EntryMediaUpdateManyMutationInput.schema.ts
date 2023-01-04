import { z } from 'zod';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaUpdateManyMutationInput> = z
	.object({
		url: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		size: z
			.union([z.number(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		duration: z
			.union([z.number(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		type: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		title: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const EntryMediaUpdateManyMutationInputObjectSchema = Schema;
