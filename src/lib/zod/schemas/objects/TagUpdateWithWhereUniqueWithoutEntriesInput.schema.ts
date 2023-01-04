import { z } from 'zod';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';
import { TagUpdateWithoutEntriesInputObjectSchema } from './TagUpdateWithoutEntriesInput.schema';
import { TagUncheckedUpdateWithoutEntriesInputObjectSchema } from './TagUncheckedUpdateWithoutEntriesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagUpdateWithWhereUniqueWithoutEntriesInput> = z
	.object({
		where: z.lazy(() => TagWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => TagUpdateWithoutEntriesInputObjectSchema),
			z.lazy(() => TagUncheckedUpdateWithoutEntriesInputObjectSchema),
		]),
	})
	.strict();

export const TagUpdateWithWhereUniqueWithoutEntriesInputObjectSchema = Schema;
