import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingCreateWithoutAnnotationInputObjectSchema } from './TaggingCreateWithoutAnnotationInput.schema';
import { TaggingUncheckedCreateWithoutAnnotationInputObjectSchema } from './TaggingUncheckedCreateWithoutAnnotationInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateOrConnectWithoutAnnotationInput> = z
	.object({
		where: z.lazy(() => TaggingWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => TaggingCreateWithoutAnnotationInputObjectSchema),
			z.lazy(() => TaggingUncheckedCreateWithoutAnnotationInputObjectSchema),
		]),
	})
	.strict();

export const TaggingCreateOrConnectWithoutAnnotationInputObjectSchema = Schema;
