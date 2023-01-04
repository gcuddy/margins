import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingCreateWithoutFeedInputObjectSchema } from './TaggingCreateWithoutFeedInput.schema';
import { TaggingUncheckedCreateWithoutFeedInputObjectSchema } from './TaggingUncheckedCreateWithoutFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateOrConnectWithoutFeedInput> = z
	.object({
		where: z.lazy(() => TaggingWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => TaggingCreateWithoutFeedInputObjectSchema),
			z.lazy(() => TaggingUncheckedCreateWithoutFeedInputObjectSchema),
		]),
	})
	.strict();

export const TaggingCreateOrConnectWithoutFeedInputObjectSchema = Schema;
