import { z } from 'zod';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';
import { TagUpdateWithoutUserInputObjectSchema } from './TagUpdateWithoutUserInput.schema';
import { TagUncheckedUpdateWithoutUserInputObjectSchema } from './TagUncheckedUpdateWithoutUserInput.schema';
import { TagCreateWithoutUserInputObjectSchema } from './TagCreateWithoutUserInput.schema';
import { TagUncheckedCreateWithoutUserInputObjectSchema } from './TagUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagUpsertWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => TagWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => TagUpdateWithoutUserInputObjectSchema),
			z.lazy(() => TagUncheckedUpdateWithoutUserInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => TagCreateWithoutUserInputObjectSchema),
			z.lazy(() => TagUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const TagUpsertWithWhereUniqueWithoutUserInputObjectSchema = Schema;
