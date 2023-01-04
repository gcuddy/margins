import { z } from 'zod';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';
import { TagUpdateWithoutEntriesInputObjectSchema } from './TagUpdateWithoutEntriesInput.schema';
import { TagUncheckedUpdateWithoutEntriesInputObjectSchema } from './TagUncheckedUpdateWithoutEntriesInput.schema';
import { TagCreateWithoutEntriesInputObjectSchema } from './TagCreateWithoutEntriesInput.schema';
import { TagUncheckedCreateWithoutEntriesInputObjectSchema } from './TagUncheckedCreateWithoutEntriesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagUpsertWithWhereUniqueWithoutEntriesInput> = z
	.object({
		where: z.lazy(() => TagWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => TagUpdateWithoutEntriesInputObjectSchema),
			z.lazy(() => TagUncheckedUpdateWithoutEntriesInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => TagCreateWithoutEntriesInputObjectSchema),
			z.lazy(() => TagUncheckedCreateWithoutEntriesInputObjectSchema),
		]),
	})
	.strict();

export const TagUpsertWithWhereUniqueWithoutEntriesInputObjectSchema = Schema;
