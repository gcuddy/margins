import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { FavoriteRelationFilterObjectSchema } from './FavoriteRelationFilter.schema';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { UserRelationFilterObjectSchema } from './UserRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { TaggingListRelationFilterObjectSchema } from './TaggingListRelationFilter.schema';
import { EntryTagListRelationFilterObjectSchema } from './EntryTagListRelationFilter.schema';
import { EntryListRelationFilterObjectSchema } from './EntryListRelationFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => TagWhereInputObjectSchema),
				z.lazy(() => TagWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => TagWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => TagWhereInputObjectSchema),
				z.lazy(() => TagWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		favorite: z
			.union([
				z.lazy(() => FavoriteRelationFilterObjectSchema),
				z.lazy(() => FavoriteWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		viewOptions: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
		user: z
			.union([
				z.lazy(() => UserRelationFilterObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema),
			])
			.optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		taggings: z.lazy(() => TaggingListRelationFilterObjectSchema).optional(),
		entryTags: z.lazy(() => EntryTagListRelationFilterObjectSchema).optional(),
		entries: z.lazy(() => EntryListRelationFilterObjectSchema).optional(),
	})
	.strict();

export const TagWhereInputObjectSchema = Schema;
