import { z } from 'zod';
import { FavoriteCreateWithoutAnnotationInputObjectSchema } from './FavoriteCreateWithoutAnnotationInput.schema';
import { FavoriteUncheckedCreateWithoutAnnotationInputObjectSchema } from './FavoriteUncheckedCreateWithoutAnnotationInput.schema';
import { FavoriteCreateOrConnectWithoutAnnotationInputObjectSchema } from './FavoriteCreateOrConnectWithoutAnnotationInput.schema';
import { FavoriteUpsertWithoutAnnotationInputObjectSchema } from './FavoriteUpsertWithoutAnnotationInput.schema';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteUpdateToOneWithWhereWithoutAnnotationInputObjectSchema } from './FavoriteUpdateToOneWithWhereWithoutAnnotationInput.schema';
import { FavoriteUpdateWithoutAnnotationInputObjectSchema } from './FavoriteUpdateWithoutAnnotationInput.schema';
import { FavoriteUncheckedUpdateWithoutAnnotationInputObjectSchema } from './FavoriteUncheckedUpdateWithoutAnnotationInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpdateOneWithoutAnnotationNestedInput> = z
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
		upsert: z.lazy(() => FavoriteUpsertWithoutAnnotationInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => FavoriteWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => FavoriteWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => FavoriteWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => FavoriteUpdateToOneWithWhereWithoutAnnotationInputObjectSchema),
				z.lazy(() => FavoriteUpdateWithoutAnnotationInputObjectSchema),
				z.lazy(() => FavoriteUncheckedUpdateWithoutAnnotationInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const FavoriteUpdateOneWithoutAnnotationNestedInputObjectSchema = Schema;
