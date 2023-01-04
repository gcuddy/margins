import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationUpdateWithoutEntryInputObjectSchema } from './AnnotationUpdateWithoutEntryInput.schema';
import { AnnotationUncheckedUpdateWithoutEntryInputObjectSchema } from './AnnotationUncheckedUpdateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpdateWithWhereUniqueWithoutEntryInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => AnnotationUpdateWithoutEntryInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationUpdateWithWhereUniqueWithoutEntryInputObjectSchema = Schema;
