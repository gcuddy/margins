import { z } from 'zod';
import { UserEntryCreateNestedOneWithoutStylesheetInputObjectSchema } from './UserEntryCreateNestedOneWithoutStylesheetInput.schema';
import { UserCreateNestedOneWithoutStylesheetsInputObjectSchema } from './UserCreateNestedOneWithoutStylesheetsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetCreateInput> = z
	.object({
		domain: z.string(),
		css: z.string(),
		entry: z.lazy(() => UserEntryCreateNestedOneWithoutStylesheetInputObjectSchema).optional(),
		user: z.lazy(() => UserCreateNestedOneWithoutStylesheetsInputObjectSchema),
	})
	.strict();

export const StylesheetCreateInputObjectSchema = Schema;
