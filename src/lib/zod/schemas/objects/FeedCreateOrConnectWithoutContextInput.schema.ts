import { z } from 'zod';
import { FeedWhereUniqueInputObjectSchema } from './FeedWhereUniqueInput.schema';
import { FeedCreateWithoutContextInputObjectSchema } from './FeedCreateWithoutContextInput.schema';
import { FeedUncheckedCreateWithoutContextInputObjectSchema } from './FeedUncheckedCreateWithoutContextInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedCreateOrConnectWithoutContextInput> = z
	.object({
		where: z.lazy(() => FeedWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => FeedCreateWithoutContextInputObjectSchema),
			z.lazy(() => FeedUncheckedCreateWithoutContextInputObjectSchema),
		]),
	})
	.strict();

export const FeedCreateOrConnectWithoutContextInputObjectSchema = Schema;
