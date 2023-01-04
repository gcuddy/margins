import { z } from 'zod';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';
import { FeedUpdateWithoutContextInputObjectSchema } from './FeedUpdateWithoutContextInput.schema';
import { FeedUncheckedUpdateWithoutContextInputObjectSchema } from './FeedUncheckedUpdateWithoutContextInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedUpdateToOneWithWhereWithoutContextInput> = z
	.object({
		where: z.lazy(() => FeedWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => FeedUpdateWithoutContextInputObjectSchema),
			z.lazy(() => FeedUncheckedUpdateWithoutContextInputObjectSchema),
		]),
	})
	.strict();

export const FeedUpdateToOneWithWhereWithoutContextInputObjectSchema = Schema;
