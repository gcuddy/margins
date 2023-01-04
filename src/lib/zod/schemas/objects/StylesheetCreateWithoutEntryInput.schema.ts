import { z } from 'zod';
import { UserCreateNestedOneWithoutStylesheetsInputObjectSchema } from './UserCreateNestedOneWithoutStylesheetsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetCreateWithoutEntryInput> = z
	.object({
		domain: z.string(),
		css: z.string(),
		user: z.lazy(() => UserCreateNestedOneWithoutStylesheetsInputObjectSchema),
	})
	.strict();

export const StylesheetCreateWithoutEntryInputObjectSchema = Schema;
