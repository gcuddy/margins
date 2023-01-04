import { z } from 'zod';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TagUpdateOneRequiredWithoutEntryTagsNestedInputObjectSchema } from './TagUpdateOneRequiredWithoutEntryTagsNestedInput.schema';
import { EntryUpdateOneRequiredWithoutEntrytagsNestedInputObjectSchema } from './EntryUpdateOneRequiredWithoutEntrytagsNestedInput.schema';
import { UserUpdateOneRequiredWithoutEntryTagNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutEntryTagNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagUpdateInput> = z
	.object({
		createdAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		updatedAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		tag: z.lazy(() => TagUpdateOneRequiredWithoutEntryTagsNestedInputObjectSchema).optional(),
		entry: z.lazy(() => EntryUpdateOneRequiredWithoutEntrytagsNestedInputObjectSchema).optional(),
		user: z.lazy(() => UserUpdateOneRequiredWithoutEntryTagNestedInputObjectSchema).optional(),
	})
	.strict();

export const EntryTagUpdateInputObjectSchema = Schema;
