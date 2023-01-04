import { z } from 'zod';
import { DocumentTypeSchema } from '../enums/DocumentType.schema';
import { EnumDocumentTypeFieldRefInputObjectSchema } from './EnumDocumentTypeFieldRefInput.schema';
import { NestedEnumDocumentTypeWithAggregatesFilterObjectSchema } from './NestedEnumDocumentTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumDocumentTypeFilterObjectSchema } from './NestedEnumDocumentTypeFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumDocumentTypeWithAggregatesFilter> = z
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
				z.lazy(() => NestedEnumDocumentTypeWithAggregatesFilterObjectSchema),
			])
			.optional(),
		_count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
		_min: z.lazy(() => NestedEnumDocumentTypeFilterObjectSchema).optional(),
		_max: z.lazy(() => NestedEnumDocumentTypeFilterObjectSchema).optional(),
	})
	.strict();

export const EnumDocumentTypeWithAggregatesFilterObjectSchema = Schema;
