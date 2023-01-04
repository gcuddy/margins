import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { FavoriteRelationFilterObjectSchema } from './FavoriteRelationFilter.schema';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SmartListWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => SmartListWhereInputObjectSchema),
				z.lazy(() => SmartListWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => SmartListWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => SmartListWhereInputObjectSchema),
				z.lazy(() => SmartListWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		filter: z.lazy(() => JsonFilterObjectSchema).optional(),
		viewOptions: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
		favorite: z
			.union([
				z.lazy(() => FavoriteRelationFilterObjectSchema),
				z.lazy(() => FavoriteWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
	})
	.strict();

export const SmartListWhereInputObjectSchema = Schema;
