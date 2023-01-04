import { z } from 'zod';
import { StylesheetCreateNestedManyWithoutEntryInputObjectSchema } from './StylesheetCreateNestedManyWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryCreateInput> = z
	.object({
		Stylesheet: z.lazy(() => StylesheetCreateNestedManyWithoutEntryInputObjectSchema).optional(),
	})
	.strict();

export const UserEntryCreateInputObjectSchema = Schema;
