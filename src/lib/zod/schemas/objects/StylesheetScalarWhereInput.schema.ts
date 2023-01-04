import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetScalarWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => StylesheetScalarWhereInputObjectSchema),
				z.lazy(() => StylesheetScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => StylesheetScalarWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => StylesheetScalarWhereInputObjectSchema),
				z.lazy(() => StylesheetScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		domain: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		css: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		userEntryId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
	})
	.strict();

export const StylesheetScalarWhereInputObjectSchema = Schema;
