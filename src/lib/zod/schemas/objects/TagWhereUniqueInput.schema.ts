import { z } from 'zod';
import { TagNameUserIdCompoundUniqueInputObjectSchema } from './TagNameUserIdCompoundUniqueInput.schema';
import { TagWhereInputObjectSchema } from './TagWhereInput.schema';
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

const Schema: z.ZodType<Prisma.TagWhereUniqueInput> = z
	.object({
		id: z.number().optional(),
		name_userId: z.lazy(() => TagNameUserIdCompoundUniqueInputObjectSchema).optional(),
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

export const TagWhereUniqueInputObjectSchema = Schema;
