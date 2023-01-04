import { z } from 'zod';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { UserUpdateOneRequiredWithoutStylesheetsNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutStylesheetsNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetUpdateWithoutEntryInput> = z
	.object({
		domain: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		css: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		user: z.lazy(() => UserUpdateOneRequiredWithoutStylesheetsNestedInputObjectSchema).optional(),
	})
	.strict();

export const StylesheetUpdateWithoutEntryInputObjectSchema = Schema;
