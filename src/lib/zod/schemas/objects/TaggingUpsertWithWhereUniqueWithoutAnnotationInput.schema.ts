import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingUpdateWithoutAnnotationInputObjectSchema } from './TaggingUpdateWithoutAnnotationInput.schema';
import { TaggingUncheckedUpdateWithoutAnnotationInputObjectSchema } from './TaggingUncheckedUpdateWithoutAnnotationInput.schema';
import { TaggingCreateWithoutAnnotationInputObjectSchema } from './TaggingCreateWithoutAnnotationInput.schema';
import { TaggingUncheckedCreateWithoutAnnotationInputObjectSchema } from './TaggingUncheckedCreateWithoutAnnotationInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpsertWithWhereUniqueWithoutAnnotationInput> = z
	.object({
		where: z.lazy(() => TaggingWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => TaggingUpdateWithoutAnnotationInputObjectSchema),
			z.lazy(() => TaggingUncheckedUpdateWithoutAnnotationInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => TaggingCreateWithoutAnnotationInputObjectSchema),
			z.lazy(() => TaggingUncheckedCreateWithoutAnnotationInputObjectSchema),
		]),
	})
	.strict();

export const TaggingUpsertWithWhereUniqueWithoutAnnotationInputObjectSchema = Schema;
