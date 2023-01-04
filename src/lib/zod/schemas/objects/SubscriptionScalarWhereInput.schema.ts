import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionScalarWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => SubscriptionScalarWhereInputObjectSchema),
				z.lazy(() => SubscriptionScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => SubscriptionScalarWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => SubscriptionScalarWhereInputObjectSchema),
				z.lazy(() => SubscriptionScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		feedId: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		download_full: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
	})
	.strict();

export const SubscriptionScalarWhereInputObjectSchema = Schema;
