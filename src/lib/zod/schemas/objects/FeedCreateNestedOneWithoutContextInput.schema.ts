import { z } from 'zod';
import { FeedCreateWithoutContextInputObjectSchema } from './FeedCreateWithoutContextInput.schema';
import { FeedUncheckedCreateWithoutContextInputObjectSchema } from './FeedUncheckedCreateWithoutContextInput.schema';
import { FeedCreateOrConnectWithoutContextInputObjectSchema } from './FeedCreateOrConnectWithoutContextInput.schema';
import { FeedWhereUniqueInputObjectSchema } from './FeedWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedCreateNestedOneWithoutContextInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FeedCreateWithoutContextInputObjectSchema),
				z.lazy(() => FeedUncheckedCreateWithoutContextInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => FeedCreateOrConnectWithoutContextInputObjectSchema).optional(),
		connect: z.lazy(() => FeedWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const FeedCreateNestedOneWithoutContextInputObjectSchema = Schema;
