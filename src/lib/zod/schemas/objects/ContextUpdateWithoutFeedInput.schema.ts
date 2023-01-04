import { z } from 'zod';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { UserUpdateOneRequiredWithoutContextNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutContextNestedInput.schema';
import { EntryUpdateOneWithoutContextNestedInputObjectSchema } from './EntryUpdateOneWithoutContextNestedInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextUpdateWithoutFeedInput> = z
	.object({
		createdAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		user: z.lazy(() => UserUpdateOneRequiredWithoutContextNestedInputObjectSchema).optional(),
		entry: z.lazy(() => EntryUpdateOneWithoutContextNestedInputObjectSchema).optional(),
		url: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
		description: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const ContextUpdateWithoutFeedInputObjectSchema = Schema;
