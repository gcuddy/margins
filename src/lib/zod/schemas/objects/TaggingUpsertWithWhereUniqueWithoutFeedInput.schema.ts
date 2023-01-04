import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingUpdateWithoutFeedInputObjectSchema } from './TaggingUpdateWithoutFeedInput.schema';
import { TaggingUncheckedUpdateWithoutFeedInputObjectSchema } from './TaggingUncheckedUpdateWithoutFeedInput.schema';
import { TaggingCreateWithoutFeedInputObjectSchema } from './TaggingCreateWithoutFeedInput.schema';
import { TaggingUncheckedCreateWithoutFeedInputObjectSchema } from './TaggingUncheckedCreateWithoutFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpsertWithWhereUniqueWithoutFeedInput> = z
	.object({
		where: z.lazy(() => TaggingWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => TaggingUpdateWithoutFeedInputObjectSchema),
			z.lazy(() => TaggingUncheckedUpdateWithoutFeedInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => TaggingCreateWithoutFeedInputObjectSchema),
			z.lazy(() => TaggingUncheckedCreateWithoutFeedInputObjectSchema),
		]),
	})
	.strict();

export const TaggingUpsertWithWhereUniqueWithoutFeedInputObjectSchema = Schema;
