import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { BoolNullableFilterObjectSchema } from './BoolNullableFilter.schema';
import { FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { EntryRelationFilterObjectSchema } from './EntryRelationFilter.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { UserRelationFilterObjectSchema } from './UserRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { BookmarkRelationFilterObjectSchema } from './BookmarkRelationFilter.schema';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => InteractionWhereInputObjectSchema),
				z.lazy(() => InteractionWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => InteractionWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => InteractionWhereInputObjectSchema),
				z.lazy(() => InteractionWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		is_read: z
			.union([z.lazy(() => BoolNullableFilterObjectSchema), z.boolean()])
			.optional()
			.nullable(),
		progress: z
			.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		finished: z
			.union([z.lazy(() => BoolNullableFilterObjectSchema), z.boolean()])
			.optional()
			.nullable(),
		entry: z
			.union([
				z.lazy(() => EntryRelationFilterObjectSchema),
				z.lazy(() => EntryWhereInputObjectSchema),
			])
			.optional(),
		entryId: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		user: z
			.union([
				z.lazy(() => UserRelationFilterObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema),
			])
			.optional(),
		bookmark: z
			.union([
				z.lazy(() => BookmarkRelationFilterObjectSchema),
				z.lazy(() => BookmarkWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		last_viewed: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		last_annotated: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		last_interaction: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
	})
	.strict();

export const InteractionWhereInputObjectSchema = Schema;
