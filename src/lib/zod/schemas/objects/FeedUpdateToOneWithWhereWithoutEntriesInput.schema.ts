import { z } from 'zod';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';
import { FeedUpdateWithoutEntriesInputObjectSchema } from './FeedUpdateWithoutEntriesInput.schema';
import { FeedUncheckedUpdateWithoutEntriesInputObjectSchema } from './FeedUncheckedUpdateWithoutEntriesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedUpdateToOneWithWhereWithoutEntriesInput> = z
	.object({
		where: z.lazy(() => FeedWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => FeedUpdateWithoutEntriesInputObjectSchema),
			z.lazy(() => FeedUncheckedUpdateWithoutEntriesInputObjectSchema),
		]),
	})
	.strict();

export const FeedUpdateToOneWithWhereWithoutEntriesInputObjectSchema = Schema;
