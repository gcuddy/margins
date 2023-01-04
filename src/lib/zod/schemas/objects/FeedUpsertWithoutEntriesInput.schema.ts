import { z } from 'zod';
import { FeedUpdateWithoutEntriesInputObjectSchema } from './FeedUpdateWithoutEntriesInput.schema';
import { FeedUncheckedUpdateWithoutEntriesInputObjectSchema } from './FeedUncheckedUpdateWithoutEntriesInput.schema';
import { FeedCreateWithoutEntriesInputObjectSchema } from './FeedCreateWithoutEntriesInput.schema';
import { FeedUncheckedCreateWithoutEntriesInputObjectSchema } from './FeedUncheckedCreateWithoutEntriesInput.schema';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedUpsertWithoutEntriesInput> = z
	.object({
		update: z.union([
			z.lazy(() => FeedUpdateWithoutEntriesInputObjectSchema),
			z.lazy(() => FeedUncheckedUpdateWithoutEntriesInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => FeedCreateWithoutEntriesInputObjectSchema),
			z.lazy(() => FeedUncheckedCreateWithoutEntriesInputObjectSchema),
		]),
		where: z.lazy(() => FeedWhereInputObjectSchema).optional(),
	})
	.strict();

export const FeedUpsertWithoutEntriesInputObjectSchema = Schema;
