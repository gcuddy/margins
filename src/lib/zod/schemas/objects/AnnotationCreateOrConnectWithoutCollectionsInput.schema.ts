import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationCreateWithoutCollectionsInputObjectSchema } from './AnnotationCreateWithoutCollectionsInput.schema';
import { AnnotationUncheckedCreateWithoutCollectionsInputObjectSchema } from './AnnotationUncheckedCreateWithoutCollectionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateOrConnectWithoutCollectionsInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => AnnotationCreateWithoutCollectionsInputObjectSchema),
			z.lazy(() => AnnotationUncheckedCreateWithoutCollectionsInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationCreateOrConnectWithoutCollectionsInputObjectSchema = Schema;
