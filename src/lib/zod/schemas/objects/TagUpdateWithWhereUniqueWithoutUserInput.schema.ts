import { z } from 'zod';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';
import { TagUpdateWithoutUserInputObjectSchema } from './TagUpdateWithoutUserInput.schema';
import { TagUncheckedUpdateWithoutUserInputObjectSchema } from './TagUncheckedUpdateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagUpdateWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => TagWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => TagUpdateWithoutUserInputObjectSchema),
			z.lazy(() => TagUncheckedUpdateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const TagUpdateWithWhereUniqueWithoutUserInputObjectSchema = Schema;
