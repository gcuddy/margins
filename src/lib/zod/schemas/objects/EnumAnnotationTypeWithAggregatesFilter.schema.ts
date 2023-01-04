import { z } from 'zod';
import { AnnotationTypeSchema } from '../enums/AnnotationType.schema';
import { EnumAnnotationTypeFieldRefInputObjectSchema } from './EnumAnnotationTypeFieldRefInput.schema';
import { NestedEnumAnnotationTypeWithAggregatesFilterObjectSchema } from './NestedEnumAnnotationTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumAnnotationTypeFilterObjectSchema } from './NestedEnumAnnotationTypeFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumAnnotationTypeWithAggregatesFilter> = z
	.object({
		equals: z
			.union([
				z.lazy(() => AnnotationTypeSchema),
				z.lazy(() => EnumAnnotationTypeFieldRefInputObjectSchema),
			])
			.optional(),
		in: z
			.lazy(() => AnnotationTypeSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => AnnotationTypeSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => AnnotationTypeSchema),
				z.lazy(() => NestedEnumAnnotationTypeWithAggregatesFilterObjectSchema),
			])
			.optional(),
		_count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
		_min: z.lazy(() => NestedEnumAnnotationTypeFilterObjectSchema).optional(),
		_max: z.lazy(() => NestedEnumAnnotationTypeFilterObjectSchema).optional(),
	})
	.strict();

export const EnumAnnotationTypeWithAggregatesFilterObjectSchema = Schema;
