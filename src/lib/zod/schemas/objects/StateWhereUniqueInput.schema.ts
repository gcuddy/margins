import { z } from 'zod';
import { StateWhereInputObjectSchema } from './StateWhereInput.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumLocationFilterObjectSchema } from './EnumLocationFilter.schema';
import { LocationSchema } from '../enums/Location.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { UserRelationFilterObjectSchema } from './UserRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { BookmarkListRelationFilterObjectSchema } from './BookmarkListRelationFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateWhereUniqueInput> = z
	.object({
		id: z.number().optional(),
		AND: z
			.union([
				z.lazy(() => StateWhereInputObjectSchema),
				z.lazy(() => StateWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => StateWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => StateWhereInputObjectSchema),
				z.lazy(() => StateWhereInputObjectSchema).array(),
			])
			.optional(),
		read_later: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		color: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		type: z
			.union([z.lazy(() => EnumLocationFilterObjectSchema), z.lazy(() => LocationSchema)])
			.optional(),
		position: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
		description: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		user: z
			.union([
				z.lazy(() => UserRelationFilterObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema),
			])
			.optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		defaultRelation: z
			.union([
				z.lazy(() => UserRelationFilterObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		default: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		bookmarks: z.lazy(() => BookmarkListRelationFilterObjectSchema).optional(),
	})
	.strict();

export const StateWhereUniqueInputObjectSchema = Schema;
