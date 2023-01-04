import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingUpdateWithoutUserInputObjectSchema } from './TaggingUpdateWithoutUserInput.schema';
import { TaggingUncheckedUpdateWithoutUserInputObjectSchema } from './TaggingUncheckedUpdateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpdateWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => TaggingWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => TaggingUpdateWithoutUserInputObjectSchema),
			z.lazy(() => TaggingUncheckedUpdateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const TaggingUpdateWithWhereUniqueWithoutUserInputObjectSchema = Schema;
