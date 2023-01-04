import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { EnumAnnotationTypeFilterObjectSchema } from './EnumAnnotationTypeFilter.schema';
import { AnnotationTypeSchema } from '../enums/AnnotationType.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationScalarWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => AnnotationScalarWhereInputObjectSchema),
				z.lazy(() => AnnotationScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => AnnotationScalarWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => AnnotationScalarWhereInputObjectSchema),
				z.lazy(() => AnnotationScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		body: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
		type: z
			.union([
				z.lazy(() => EnumAnnotationTypeFilterObjectSchema),
				z.lazy(() => AnnotationTypeSchema),
			])
			.optional(),
		private: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		target: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
		entryId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		parentId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		deleted: z
			.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()])
			.optional()
			.nullable(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		sortOrder: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
		bookmarkId: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
	})
	.strict();

export const AnnotationScalarWhereInputObjectSchema = Schema;
