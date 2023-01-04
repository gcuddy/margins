import { z } from 'zod';
import { FeedWhereUniqueInputObjectSchema } from './FeedWhereUniqueInput.schema';
import { FeedCreateWithoutEntriesInputObjectSchema } from './FeedCreateWithoutEntriesInput.schema';
import { FeedUncheckedCreateWithoutEntriesInputObjectSchema } from './FeedUncheckedCreateWithoutEntriesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedCreateOrConnectWithoutEntriesInput> = z
	.object({
		where: z.lazy(() => FeedWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => FeedCreateWithoutEntriesInputObjectSchema),
			z.lazy(() => FeedUncheckedCreateWithoutEntriesInputObjectSchema),
		]),
	})
	.strict();

export const FeedCreateOrConnectWithoutEntriesInputObjectSchema = Schema;
