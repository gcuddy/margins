import { z } from 'zod';
import { AnnotationCreateWithoutFavoriteInputObjectSchema } from './AnnotationCreateWithoutFavoriteInput.schema';
import { AnnotationUncheckedCreateWithoutFavoriteInputObjectSchema } from './AnnotationUncheckedCreateWithoutFavoriteInput.schema';
import { AnnotationCreateOrConnectWithoutFavoriteInputObjectSchema } from './AnnotationCreateOrConnectWithoutFavoriteInput.schema';
import { AnnotationUpsertWithoutFavoriteInputObjectSchema } from './AnnotationUpsertWithoutFavoriteInput.schema';
import { AnnotationWhereInputObjectSchema } from './AnnotationWhereInput.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationUpdateToOneWithWhereWithoutFavoriteInputObjectSchema } from './AnnotationUpdateToOneWithWhereWithoutFavoriteInput.schema';
import { AnnotationUpdateWithoutFavoriteInputObjectSchema } from './AnnotationUpdateWithoutFavoriteInput.schema';
import { AnnotationUncheckedUpdateWithoutFavoriteInputObjectSchema } from './AnnotationUncheckedUpdateWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpdateOneWithoutFavoriteNestedInput> = z
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
		upsert: z.lazy(() => AnnotationUpsertWithoutFavoriteInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => AnnotationWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => AnnotationWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => AnnotationWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => AnnotationUpdateToOneWithWhereWithoutFavoriteInputObjectSchema),
				z.lazy(() => AnnotationUpdateWithoutFavoriteInputObjectSchema),
				z.lazy(() => AnnotationUncheckedUpdateWithoutFavoriteInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const AnnotationUpdateOneWithoutFavoriteNestedInputObjectSchema = Schema;
