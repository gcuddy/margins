import { z } from 'zod';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { UserEntryUpdateOneWithoutStylesheetNestedInputObjectSchema } from './UserEntryUpdateOneWithoutStylesheetNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetUpdateWithoutUserInput> = z
	.object({
		domain: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		css: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		entry: z.lazy(() => UserEntryUpdateOneWithoutStylesheetNestedInputObjectSchema).optional(),
	})
	.strict();

export const StylesheetUpdateWithoutUserInputObjectSchema = Schema;
