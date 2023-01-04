import { z } from 'zod';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TagUpdateOneRequiredWithoutEntryTagsNestedInputObjectSchema } from './TagUpdateOneRequiredWithoutEntryTagsNestedInput.schema';
import { UserUpdateOneRequiredWithoutEntryTagNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutEntryTagNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagUpdateWithoutEntryInput> = z
	.object({
		createdAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		updatedAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		tag: z.lazy(() => TagUpdateOneRequiredWithoutEntryTagsNestedInputObjectSchema).optional(),
		user: z.lazy(() => UserUpdateOneRequiredWithoutEntryTagNestedInputObjectSchema).optional(),
	})
	.strict();

export const EntryTagUpdateWithoutEntryInputObjectSchema = Schema;
