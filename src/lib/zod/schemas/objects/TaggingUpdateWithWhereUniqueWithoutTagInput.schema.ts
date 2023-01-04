import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingUpdateWithoutTagInputObjectSchema } from './TaggingUpdateWithoutTagInput.schema';
import { TaggingUncheckedUpdateWithoutTagInputObjectSchema } from './TaggingUncheckedUpdateWithoutTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpdateWithWhereUniqueWithoutTagInput> = z
	.object({
		where: z.lazy(() => TaggingWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => TaggingUpdateWithoutTagInputObjectSchema),
			z.lazy(() => TaggingUncheckedUpdateWithoutTagInputObjectSchema),
		]),
	})
	.strict();

export const TaggingUpdateWithWhereUniqueWithoutTagInputObjectSchema = Schema;
