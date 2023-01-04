import { z } from 'zod';
import { UserEntryCreateNestedOneWithoutStylesheetInputObjectSchema } from './UserEntryCreateNestedOneWithoutStylesheetInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetCreateWithoutUserInput> = z
	.object({
		domain: z.string(),
		css: z.string(),
		entry: z.lazy(() => UserEntryCreateNestedOneWithoutStylesheetInputObjectSchema).optional(),
	})
	.strict();

export const StylesheetCreateWithoutUserInputObjectSchema = Schema;
