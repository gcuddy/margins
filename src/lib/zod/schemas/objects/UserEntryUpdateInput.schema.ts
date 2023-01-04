import { z } from 'zod';
import { StylesheetUpdateManyWithoutEntryNestedInputObjectSchema } from './StylesheetUpdateManyWithoutEntryNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryUpdateInput> = z
	.object({
		Stylesheet: z.lazy(() => StylesheetUpdateManyWithoutEntryNestedInputObjectSchema).optional(),
	})
	.strict();

export const UserEntryUpdateInputObjectSchema = Schema;
