import { z } from 'zod';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { EntryUpdateOneWithoutContextNestedInputObjectSchema } from './EntryUpdateOneWithoutContextNestedInput.schema';
import { FeedUpdateOneWithoutContextNestedInputObjectSchema } from './FeedUpdateOneWithoutContextNestedInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextUpdateWithoutUserInput> = z
	.object({
		createdAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		entry: z.lazy(() => EntryUpdateOneWithoutContextNestedInputObjectSchema).optional(),
		feed: z.lazy(() => FeedUpdateOneWithoutContextNestedInputObjectSchema).optional(),
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

export const ContextUpdateWithoutUserInputObjectSchema = Schema;
