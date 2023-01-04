import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { UserRelationFilterObjectSchema } from './UserRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { FavoriteListRelationFilterObjectSchema } from './FavoriteListRelationFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => FavoriteFolderWhereInputObjectSchema),
				z.lazy(() => FavoriteFolderWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => FavoriteFolderWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => FavoriteFolderWhereInputObjectSchema),
				z.lazy(() => FavoriteFolderWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		user: z
			.union([
				z.lazy(() => UserRelationFilterObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema),
			])
			.optional(),
		favorites: z.lazy(() => FavoriteListRelationFilterObjectSchema).optional(),
	})
	.strict();

export const FavoriteFolderWhereInputObjectSchema = Schema;
