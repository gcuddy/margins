import { z } from 'zod';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { TagRelationFilterObjectSchema } from './TagRelationFilter.schema';
import { TagWhereInputObjectSchema } from './TagWhereInput.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { EntryRelationFilterObjectSchema } from './EntryRelationFilter.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';
import { UserRelationFilterObjectSchema } from './UserRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => EntryTagWhereInputObjectSchema),
				z.lazy(() => EntryTagWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => EntryTagWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => EntryTagWhereInputObjectSchema),
				z.lazy(() => EntryTagWhereInputObjectSchema).array(),
			])
			.optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		tag: z
			.union([z.lazy(() => TagRelationFilterObjectSchema), z.lazy(() => TagWhereInputObjectSchema)])
			.optional(),
		tagId: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		entry: z
			.union([
				z.lazy(() => EntryRelationFilterObjectSchema),
				z.lazy(() => EntryWhereInputObjectSchema),
			])
			.optional(),
		entryId: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		user: z
			.union([
				z.lazy(() => UserRelationFilterObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema),
			])
			.optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
	})
	.strict();

export const EntryTagWhereInputObjectSchema = Schema;
