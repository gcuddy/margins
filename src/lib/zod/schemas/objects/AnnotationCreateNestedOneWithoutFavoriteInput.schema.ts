import { z } from 'zod';
import { AnnotationCreateWithoutFavoriteInputObjectSchema } from './AnnotationCreateWithoutFavoriteInput.schema';
import { AnnotationUncheckedCreateWithoutFavoriteInputObjectSchema } from './AnnotationUncheckedCreateWithoutFavoriteInput.schema';
import { AnnotationCreateOrConnectWithoutFavoriteInputObjectSchema } from './AnnotationCreateOrConnectWithoutFavoriteInput.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateNestedOneWithoutFavoriteInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => AnnotationCreateWithoutFavoriteInputObjectSchema),
				z.lazy(() => AnnotationUncheckedCreateWithoutFavoriteInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => AnnotationCreateOrConnectWithoutFavoriteInputObjectSchema)
			.optional(),
		connect: z.lazy(() => AnnotationWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const AnnotationCreateNestedOneWithoutFavoriteInputObjectSchema = Schema;
