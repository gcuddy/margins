import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumLocationFilterObjectSchema } from './EnumLocationFilter.schema';
import { LocationSchema } from '../enums/Location.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateScalarWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => StateScalarWhereInputObjectSchema),
				z.lazy(() => StateScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => StateScalarWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => StateScalarWhereInputObjectSchema),
				z.lazy(() => StateScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		read_later: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		color: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		type: z
			.union([z.lazy(() => EnumLocationFilterObjectSchema), z.lazy(() => LocationSchema)])
			.optional(),
		position: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
		description: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		default: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
	})
	.strict();

export const StateScalarWhereInputObjectSchema = Schema;
