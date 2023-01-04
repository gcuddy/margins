import { z } from 'zod';
import { DocumentTypeSchema } from '../enums/DocumentType.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumDocumentTypeFieldUpdateOperationsInput> = z
	.object({
		set: z.lazy(() => DocumentTypeSchema).optional(),
	})
	.strict();

export const EnumDocumentTypeFieldUpdateOperationsInputObjectSchema = Schema;
