import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingUpdateWithoutFeedInputObjectSchema } from './TaggingUpdateWithoutFeedInput.schema';
import { TaggingUncheckedUpdateWithoutFeedInputObjectSchema } from './TaggingUncheckedUpdateWithoutFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpdateWithWhereUniqueWithoutFeedInput> = z
	.object({
		where: z.lazy(() => TaggingWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => TaggingUpdateWithoutFeedInputObjectSchema),
			z.lazy(() => TaggingUncheckedUpdateWithoutFeedInputObjectSchema),
		]),
	})
	.strict();

export const TaggingUpdateWithWhereUniqueWithoutFeedInputObjectSchema = Schema;
