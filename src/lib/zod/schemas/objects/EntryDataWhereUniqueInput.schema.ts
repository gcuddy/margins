import { z } from 'zod';
import { EntryDataEntryIdUserIdCompoundUniqueInputObjectSchema } from './EntryDataEntryIdUserIdCompoundUniqueInput.schema';
import { EntryDataWhereInputObjectSchema } from './EntryDataWhereInput.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { EntryMediaListRelationFilterObjectSchema } from './EntryMediaListRelationFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EntryRelationFilterObjectSchema } from './EntryRelationFilter.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';
import { UserRelationFilterObjectSchema } from './UserRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataWhereUniqueInput> = z
	.object({
		id: z.number().optional(),
		entryId: z.number().optional(),
		entryId_userId: z.lazy(() => EntryDataEntryIdUserIdCompoundUniqueInputObjectSchema).optional(),
		AND: z
			.union([
				z.lazy(() => EntryDataWhereInputObjectSchema),
				z.lazy(() => EntryDataWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => EntryDataWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => EntryDataWhereInputObjectSchema),
				z.lazy(() => EntryDataWhereInputObjectSchema).array(),
			])
			.optional(),
		html: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		text: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		custom: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
		image: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		wordCount: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		summary: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		media: z.lazy(() => EntryMediaListRelationFilterObjectSchema).optional(),
		data: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
		published: z
			.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()])
			.optional()
			.nullable(),
		updated: z
			.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()])
			.optional()
			.nullable(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		entry: z
			.union([
				z.lazy(() => EntryRelationFilterObjectSchema),
				z.lazy(() => EntryWhereInputObjectSchema),
			])
			.optional(),
		user: z
			.union([
				z.lazy(() => UserRelationFilterObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema),
			])
			.optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
	})
	.strict();

export const EntryDataWhereUniqueInputObjectSchema = Schema;
