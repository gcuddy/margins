import { z } from 'zod';
import { CollectionUserIdNameCompoundUniqueInputObjectSchema } from './CollectionUserIdNameCompoundUniqueInput.schema';
import { CollectionWhereInputObjectSchema } from './CollectionWhereInput.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { UserRelationFilterObjectSchema } from './UserRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { CollectionItemsListRelationFilterObjectSchema } from './CollectionItemsListRelationFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionWhereUniqueInput> = z
	.object({
		id: z.number().optional(),
		userId_name: z.lazy(() => CollectionUserIdNameCompoundUniqueInputObjectSchema).optional(),
		AND: z
			.union([
				z.lazy(() => CollectionWhereInputObjectSchema),
				z.lazy(() => CollectionWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => CollectionWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => CollectionWhereInputObjectSchema),
				z.lazy(() => CollectionWhereInputObjectSchema).array(),
			])
			.optional(),
		name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		private: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		icon: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
		user: z
			.union([
				z.lazy(() => UserRelationFilterObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema),
			])
			.optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		description: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		items: z.lazy(() => CollectionItemsListRelationFilterObjectSchema).optional(),
	})
	.strict();

export const CollectionWhereUniqueInputObjectSchema = Schema;
