import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkScalarWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => BookmarkScalarWhereInputObjectSchema),
				z.lazy(() => BookmarkScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => BookmarkScalarWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => BookmarkScalarWhereInputObjectSchema),
				z.lazy(() => BookmarkScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		context: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
		uri: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		entryId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		sortOrder: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		is_read: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		progress: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
		data: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
		stateId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		private: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		interactionId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		favoriteId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		deleted: z
			.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()])
			.optional()
			.nullable(),
	})
	.strict();

export const BookmarkScalarWhereInputObjectSchema = Schema;
