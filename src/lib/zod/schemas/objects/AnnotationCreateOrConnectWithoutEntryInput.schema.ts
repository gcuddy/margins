import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationCreateWithoutEntryInputObjectSchema } from './AnnotationCreateWithoutEntryInput.schema';
import { AnnotationUncheckedCreateWithoutEntryInputObjectSchema } from './AnnotationUncheckedCreateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateOrConnectWithoutEntryInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => AnnotationCreateWithoutEntryInputObjectSchema),
			z.lazy(() => AnnotationUncheckedCreateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationCreateOrConnectWithoutEntryInputObjectSchema = Schema;
