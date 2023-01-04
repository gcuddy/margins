import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingUpdateWithoutUserInputObjectSchema } from './TaggingUpdateWithoutUserInput.schema';
import { TaggingUncheckedUpdateWithoutUserInputObjectSchema } from './TaggingUncheckedUpdateWithoutUserInput.schema';
import { TaggingCreateWithoutUserInputObjectSchema } from './TaggingCreateWithoutUserInput.schema';
import { TaggingUncheckedCreateWithoutUserInputObjectSchema } from './TaggingUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpsertWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => TaggingWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => TaggingUpdateWithoutUserInputObjectSchema),
			z.lazy(() => TaggingUncheckedUpdateWithoutUserInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => TaggingCreateWithoutUserInputObjectSchema),
			z.lazy(() => TaggingUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const TaggingUpsertWithWhereUniqueWithoutUserInputObjectSchema = Schema;
