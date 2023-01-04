import { z } from 'zod';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteCreateWithoutAnnotationInputObjectSchema } from './FavoriteCreateWithoutAnnotationInput.schema';
import { FavoriteUncheckedCreateWithoutAnnotationInputObjectSchema } from './FavoriteUncheckedCreateWithoutAnnotationInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteCreateOrConnectWithoutAnnotationInput> = z
	.object({
		where: z.lazy(() => FavoriteWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => FavoriteCreateWithoutAnnotationInputObjectSchema),
			z.lazy(() => FavoriteUncheckedCreateWithoutAnnotationInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteCreateOrConnectWithoutAnnotationInputObjectSchema = Schema;
