import { z } from 'zod';
import { StylesheetUncheckedCreateNestedManyWithoutEntryInputObjectSchema } from './StylesheetUncheckedCreateNestedManyWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryUncheckedCreateInput> = z
	.object({
		id: z.number().optional(),
		Stylesheet: z
			.lazy(() => StylesheetUncheckedCreateNestedManyWithoutEntryInputObjectSchema)
			.optional(),
	})
	.strict();

export const UserEntryUncheckedCreateInputObjectSchema = Schema;
