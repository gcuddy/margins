import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { BoolNullableFilterObjectSchema } from './BoolNullableFilter.schema';
import { FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionScalarWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => InteractionScalarWhereInputObjectSchema),
				z.lazy(() => InteractionScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => InteractionScalarWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => InteractionScalarWhereInputObjectSchema),
				z.lazy(() => InteractionScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		is_read: z
			.union([z.lazy(() => BoolNullableFilterObjectSchema), z.boolean()])
			.optional()
			.nullable(),
		progress: z
			.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		finished: z
			.union([z.lazy(() => BoolNullableFilterObjectSchema), z.boolean()])
			.optional()
			.nullable(),
		entryId: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		last_viewed: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		last_annotated: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		last_interaction: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
	})
	.strict();

export const InteractionScalarWhereInputObjectSchema = Schema;
