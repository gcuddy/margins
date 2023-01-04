import { z } from 'zod';
import { FeedWhereUniqueInputObjectSchema } from './FeedWhereUniqueInput.schema';
import { FeedCreateWithoutTagsInputObjectSchema } from './FeedCreateWithoutTagsInput.schema';
import { FeedUncheckedCreateWithoutTagsInputObjectSchema } from './FeedUncheckedCreateWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedCreateOrConnectWithoutTagsInput> = z
	.object({
		where: z.lazy(() => FeedWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => FeedCreateWithoutTagsInputObjectSchema),
			z.lazy(() => FeedUncheckedCreateWithoutTagsInputObjectSchema),
		]),
	})
	.strict();

export const FeedCreateOrConnectWithoutTagsInputObjectSchema = Schema;
