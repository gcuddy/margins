import { z } from 'zod';
import { AnnotationTypeSchema } from '../enums/AnnotationType.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumAnnotationTypeFieldUpdateOperationsInput> = z
	.object({
		set: z.lazy(() => AnnotationTypeSchema).optional(),
	})
	.strict();

export const EnumAnnotationTypeFieldUpdateOperationsInputObjectSchema = Schema;
