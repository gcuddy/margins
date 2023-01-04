import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationUpdateWithoutEntryInputObjectSchema } from './AnnotationUpdateWithoutEntryInput.schema';
import { AnnotationUncheckedUpdateWithoutEntryInputObjectSchema } from './AnnotationUncheckedUpdateWithoutEntryInput.schema';
import { AnnotationCreateWithoutEntryInputObjectSchema } from './AnnotationCreateWithoutEntryInput.schema';
import { AnnotationUncheckedCreateWithoutEntryInputObjectSchema } from './AnnotationUncheckedCreateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpsertWithWhereUniqueWithoutEntryInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => AnnotationUpdateWithoutEntryInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateWithoutEntryInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => AnnotationCreateWithoutEntryInputObjectSchema),
			z.lazy(() => AnnotationUncheckedCreateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationUpsertWithWhereUniqueWithoutEntryInputObjectSchema = Schema;
