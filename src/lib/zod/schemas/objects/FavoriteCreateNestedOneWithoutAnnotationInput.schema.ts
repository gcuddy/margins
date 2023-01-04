import { z } from 'zod';
import { FavoriteCreateWithoutAnnotationInputObjectSchema } from './FavoriteCreateWithoutAnnotationInput.schema';
import { FavoriteUncheckedCreateWithoutAnnotationInputObjectSchema } from './FavoriteUncheckedCreateWithoutAnnotationInput.schema';
import { FavoriteCreateOrConnectWithoutAnnotationInputObjectSchema } from './FavoriteCreateOrConnectWithoutAnnotationInput.schema';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteCreateNestedOneWithoutAnnotationInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FavoriteCreateWithoutAnnotationInputObjectSchema),
				z.lazy(() => FavoriteUncheckedCreateWithoutAnnotationInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => FavoriteCreateOrConnectWithoutAnnotationInputObjectSchema)
			.optional(),
		connect: z.lazy(() => FavoriteWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteCreateNestedOneWithoutAnnotationInputObjectSchema = Schema;
