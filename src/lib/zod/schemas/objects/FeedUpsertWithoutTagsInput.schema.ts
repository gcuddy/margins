import { z } from 'zod';
import { FeedUpdateWithoutTagsInputObjectSchema } from './FeedUpdateWithoutTagsInput.schema';
import { FeedUncheckedUpdateWithoutTagsInputObjectSchema } from './FeedUncheckedUpdateWithoutTagsInput.schema';
import { FeedCreateWithoutTagsInputObjectSchema } from './FeedCreateWithoutTagsInput.schema';
import { FeedUncheckedCreateWithoutTagsInputObjectSchema } from './FeedUncheckedCreateWithoutTagsInput.schema';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedUpsertWithoutTagsInput> = z
	.object({
		update: z.union([
			z.lazy(() => FeedUpdateWithoutTagsInputObjectSchema),
			z.lazy(() => FeedUncheckedUpdateWithoutTagsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => FeedCreateWithoutTagsInputObjectSchema),
			z.lazy(() => FeedUncheckedCreateWithoutTagsInputObjectSchema),
		]),
		where: z.lazy(() => FeedWhereInputObjectSchema).optional(),
	})
	.strict();

export const FeedUpsertWithoutTagsInputObjectSchema = Schema;
