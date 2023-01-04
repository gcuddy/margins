import { z } from 'zod';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableBoolFieldUpdateOperationsInputObjectSchema } from './NullableBoolFieldUpdateOperationsInput.schema';
import { NullableFloatFieldUpdateOperationsInputObjectSchema } from './NullableFloatFieldUpdateOperationsInput.schema';
import { EntryUpdateOneRequiredWithoutInteractionsNestedInputObjectSchema } from './EntryUpdateOneRequiredWithoutInteractionsNestedInput.schema';
import { UserUpdateOneRequiredWithoutInteractionsNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutInteractionsNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionUpdateWithoutBookmarkInput> = z
	.object({
		createdAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		updatedAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		is_read: z
			.union([z.boolean(), z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		progress: z
			.union([z.number(), z.lazy(() => NullableFloatFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		finished: z
			.union([z.boolean(), z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		entry: z
			.lazy(() => EntryUpdateOneRequiredWithoutInteractionsNestedInputObjectSchema)
			.optional(),
		user: z.lazy(() => UserUpdateOneRequiredWithoutInteractionsNestedInputObjectSchema).optional(),
		last_viewed: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		last_annotated: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		last_interaction: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
	})
	.strict();

export const InteractionUpdateWithoutBookmarkInputObjectSchema = Schema;
