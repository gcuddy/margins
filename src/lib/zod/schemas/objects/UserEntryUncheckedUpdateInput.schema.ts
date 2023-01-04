import { z } from 'zod';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { StylesheetUncheckedUpdateManyWithoutEntryNestedInputObjectSchema } from './StylesheetUncheckedUpdateManyWithoutEntryNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryUncheckedUpdateInput> = z
	.object({
		id: z.union([z.number(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
		Stylesheet: z
			.lazy(() => StylesheetUncheckedUpdateManyWithoutEntryNestedInputObjectSchema)
			.optional(),
	})
	.strict();

export const UserEntryUncheckedUpdateInputObjectSchema = Schema;
