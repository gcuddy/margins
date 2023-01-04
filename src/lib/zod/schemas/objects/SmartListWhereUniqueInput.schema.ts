import { z } from 'zod';
import { SmartListWhereInputObjectSchema } from './SmartListWhereInput.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { FavoriteRelationFilterObjectSchema } from './FavoriteRelationFilter.schema';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SmartListWhereUniqueInput> = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
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

export const SmartListWhereUniqueInputObjectSchema = Schema;
