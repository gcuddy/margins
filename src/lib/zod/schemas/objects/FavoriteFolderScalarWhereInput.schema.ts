import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderScalarWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => FavoriteFolderScalarWhereInputObjectSchema),
				z.lazy(() => FavoriteFolderScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => FavoriteFolderScalarWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => FavoriteFolderScalarWhereInputObjectSchema),
				z.lazy(() => FavoriteFolderScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
	})
	.strict();

export const FavoriteFolderScalarWhereInputObjectSchema = Schema;
