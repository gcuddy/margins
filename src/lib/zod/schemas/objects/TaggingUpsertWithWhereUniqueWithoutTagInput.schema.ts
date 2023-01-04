import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingUpdateWithoutTagInputObjectSchema } from './TaggingUpdateWithoutTagInput.schema';
import { TaggingUncheckedUpdateWithoutTagInputObjectSchema } from './TaggingUncheckedUpdateWithoutTagInput.schema';
import { TaggingCreateWithoutTagInputObjectSchema } from './TaggingCreateWithoutTagInput.schema';
import { TaggingUncheckedCreateWithoutTagInputObjectSchema } from './TaggingUncheckedCreateWithoutTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpsertWithWhereUniqueWithoutTagInput> = z
	.object({
		where: z.lazy(() => TaggingWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => TaggingUpdateWithoutTagInputObjectSchema),
			z.lazy(() => TaggingUncheckedUpdateWithoutTagInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => TaggingCreateWithoutTagInputObjectSchema),
			z.lazy(() => TaggingUncheckedCreateWithoutTagInputObjectSchema),
		]),
	})
	.strict();

export const TaggingUpsertWithWhereUniqueWithoutTagInputObjectSchema = Schema;
