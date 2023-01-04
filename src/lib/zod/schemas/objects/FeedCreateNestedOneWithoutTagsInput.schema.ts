import { z } from 'zod';
import { FeedCreateWithoutTagsInputObjectSchema } from './FeedCreateWithoutTagsInput.schema';
import { FeedUncheckedCreateWithoutTagsInputObjectSchema } from './FeedUncheckedCreateWithoutTagsInput.schema';
import { FeedCreateOrConnectWithoutTagsInputObjectSchema } from './FeedCreateOrConnectWithoutTagsInput.schema';
import { FeedWhereUniqueInputObjectSchema } from './FeedWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedCreateNestedOneWithoutTagsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FeedCreateWithoutTagsInputObjectSchema),
				z.lazy(() => FeedUncheckedCreateWithoutTagsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => FeedCreateOrConnectWithoutTagsInputObjectSchema).optional(),
		connect: z.lazy(() => FeedWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const FeedCreateNestedOneWithoutTagsInputObjectSchema = Schema;
