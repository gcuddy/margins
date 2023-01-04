import { z } from 'zod';
import { FeedCreateWithoutEntriesInputObjectSchema } from './FeedCreateWithoutEntriesInput.schema';
import { FeedUncheckedCreateWithoutEntriesInputObjectSchema } from './FeedUncheckedCreateWithoutEntriesInput.schema';
import { FeedCreateOrConnectWithoutEntriesInputObjectSchema } from './FeedCreateOrConnectWithoutEntriesInput.schema';
import { FeedWhereUniqueInputObjectSchema } from './FeedWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedCreateNestedOneWithoutEntriesInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FeedCreateWithoutEntriesInputObjectSchema),
				z.lazy(() => FeedUncheckedCreateWithoutEntriesInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => FeedCreateOrConnectWithoutEntriesInputObjectSchema).optional(),
		connect: z.lazy(() => FeedWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const FeedCreateNestedOneWithoutEntriesInputObjectSchema = Schema;
