import { z } from 'zod';
import { FeedUpdateWithoutContextInputObjectSchema } from './FeedUpdateWithoutContextInput.schema';
import { FeedUncheckedUpdateWithoutContextInputObjectSchema } from './FeedUncheckedUpdateWithoutContextInput.schema';
import { FeedCreateWithoutContextInputObjectSchema } from './FeedCreateWithoutContextInput.schema';
import { FeedUncheckedCreateWithoutContextInputObjectSchema } from './FeedUncheckedCreateWithoutContextInput.schema';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedUpsertWithoutContextInput> = z
	.object({
		update: z.union([
			z.lazy(() => FeedUpdateWithoutContextInputObjectSchema),
			z.lazy(() => FeedUncheckedUpdateWithoutContextInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => FeedCreateWithoutContextInputObjectSchema),
			z.lazy(() => FeedUncheckedCreateWithoutContextInputObjectSchema),
		]),
		where: z.lazy(() => FeedWhereInputObjectSchema).optional(),
	})
	.strict();

export const FeedUpsertWithoutContextInputObjectSchema = Schema;
