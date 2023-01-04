import { z } from 'zod';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';
import { FeedUpdateWithoutTagsInputObjectSchema } from './FeedUpdateWithoutTagsInput.schema';
import { FeedUncheckedUpdateWithoutTagsInputObjectSchema } from './FeedUncheckedUpdateWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedUpdateToOneWithWhereWithoutTagsInput> = z
	.object({
		where: z.lazy(() => FeedWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => FeedUpdateWithoutTagsInputObjectSchema),
			z.lazy(() => FeedUncheckedUpdateWithoutTagsInputObjectSchema),
		]),
	})
	.strict();

export const FeedUpdateToOneWithWhereWithoutTagsInputObjectSchema = Schema;
