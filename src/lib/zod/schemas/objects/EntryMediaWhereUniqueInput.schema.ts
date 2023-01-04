import { z } from 'zod';
import { EntryMediaWhereInputObjectSchema } from './EntryMediaWhereInput.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { EntryDataRelationFilterObjectSchema } from './EntryDataRelationFilter.schema';
import { EntryDataWhereInputObjectSchema } from './EntryDataWhereInput.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { EntryRelationFilterObjectSchema } from './EntryRelationFilter.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaWhereUniqueInput> = z
	.object({
		id: z.number().optional(),
		AND: z
			.union([
				z.lazy(() => EntryMediaWhereInputObjectSchema),
				z.lazy(() => EntryMediaWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => EntryMediaWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => EntryMediaWhereInputObjectSchema),
				z.lazy(() => EntryMediaWhereInputObjectSchema).array(),
			])
			.optional(),
		url: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		size: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		duration: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		type: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		title: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		DocumentData: z
			.union([
				z.lazy(() => EntryDataRelationFilterObjectSchema),
				z.lazy(() => EntryDataWhereInputObjectSchema),
			])
			.optional(),
		documentDataId: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		Entry: z
			.union([
				z.lazy(() => EntryRelationFilterObjectSchema),
				z.lazy(() => EntryWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		entryId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
	})
	.strict();

export const EntryMediaWhereUniqueInputObjectSchema = Schema;
