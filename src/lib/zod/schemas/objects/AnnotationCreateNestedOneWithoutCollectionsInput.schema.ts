import { z } from 'zod';
import { AnnotationCreateWithoutCollectionsInputObjectSchema } from './AnnotationCreateWithoutCollectionsInput.schema';
import { AnnotationUncheckedCreateWithoutCollectionsInputObjectSchema } from './AnnotationUncheckedCreateWithoutCollectionsInput.schema';
import { AnnotationCreateOrConnectWithoutCollectionsInputObjectSchema } from './AnnotationCreateOrConnectWithoutCollectionsInput.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateNestedOneWithoutCollectionsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => AnnotationCreateWithoutCollectionsInputObjectSchema),
				z.lazy(() => AnnotationUncheckedCreateWithoutCollectionsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => AnnotationCreateOrConnectWithoutCollectionsInputObjectSchema)
			.optional(),
		connect: z.lazy(() => AnnotationWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const AnnotationCreateNestedOneWithoutCollectionsInputObjectSchema = Schema;
