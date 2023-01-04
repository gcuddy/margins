import { z } from 'zod';
import { IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { EnumAnnotationTypeWithAggregatesFilterObjectSchema } from './EnumAnnotationTypeWithAggregatesFilter.schema';
import { AnnotationTypeSchema } from '../enums/AnnotationType.schema';
import { BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { FloatWithAggregatesFilterObjectSchema } from './FloatWithAggregatesFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationScalarWhereWithAggregatesInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => AnnotationScalarWhereWithAggregatesInputObjectSchema),
				z.lazy(() => AnnotationScalarWhereWithAggregatesInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => AnnotationScalarWhereWithAggregatesInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => AnnotationScalarWhereWithAggregatesInputObjectSchema),
				z.lazy(() => AnnotationScalarWhereWithAggregatesInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()]).optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()])
			.optional(),
		body: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
		type: z
			.union([
				z.lazy(() => EnumAnnotationTypeWithAggregatesFilterObjectSchema),
				z.lazy(() => AnnotationTypeSchema),
			])
			.optional(),
		private: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
		target: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
		entryId: z
			.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		parentId: z
			.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		deleted: z
			.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.date()])
			.optional()
			.nullable(),
		userId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
		sortOrder: z
			.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()])
			.optional(),
		bookmarkId: z
			.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
	})
	.strict();

export const AnnotationScalarWhereWithAggregatesInputObjectSchema = Schema;
