import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingUpdateWithoutAnnotationInputObjectSchema } from './TaggingUpdateWithoutAnnotationInput.schema';
import { TaggingUncheckedUpdateWithoutAnnotationInputObjectSchema } from './TaggingUncheckedUpdateWithoutAnnotationInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpdateWithWhereUniqueWithoutAnnotationInput> = z
	.object({
		where: z.lazy(() => TaggingWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => TaggingUpdateWithoutAnnotationInputObjectSchema),
			z.lazy(() => TaggingUncheckedUpdateWithoutAnnotationInputObjectSchema),
		]),
	})
	.strict();

export const TaggingUpdateWithWhereUniqueWithoutAnnotationInputObjectSchema = Schema;
