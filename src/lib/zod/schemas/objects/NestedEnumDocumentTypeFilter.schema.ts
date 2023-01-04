import { z } from 'zod';
import { DocumentTypeSchema } from '../enums/DocumentType.schema';
import { EnumDocumentTypeFieldRefInputObjectSchema } from './EnumDocumentTypeFieldRefInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.NestedEnumDocumentTypeFilter> = z
	.object({
		equals: z
			.union([
				z.lazy(() => DocumentTypeSchema),
				z.lazy(() => EnumDocumentTypeFieldRefInputObjectSchema),
			])
			.optional(),
		in: z
			.lazy(() => DocumentTypeSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => DocumentTypeSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => DocumentTypeSchema),
				z.lazy(() => NestedEnumDocumentTypeFilterObjectSchema),
			])
			.optional(),
	})
	.strict();

export const NestedEnumDocumentTypeFilterObjectSchema = Schema;
