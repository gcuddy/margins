import { z } from 'zod';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { EntryDataUpdateOneRequiredWithoutMediaNestedInputObjectSchema } from './EntryDataUpdateOneRequiredWithoutMediaNestedInput.schema';
import { EntryUpdateOneWithoutEntryMediaNestedInputObjectSchema } from './EntryUpdateOneWithoutEntryMediaNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaUpdateInput> = z
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
		DocumentData: z
			.lazy(() => EntryDataUpdateOneRequiredWithoutMediaNestedInputObjectSchema)
			.optional(),
		Entry: z.lazy(() => EntryUpdateOneWithoutEntryMediaNestedInputObjectSchema).optional(),
	})
	.strict();

export const EntryMediaUpdateInputObjectSchema = Schema;
