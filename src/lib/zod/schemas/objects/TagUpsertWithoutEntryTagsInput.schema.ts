import { z } from 'zod';
import { TagUpdateWithoutEntryTagsInputObjectSchema } from './TagUpdateWithoutEntryTagsInput.schema';
import { TagUncheckedUpdateWithoutEntryTagsInputObjectSchema } from './TagUncheckedUpdateWithoutEntryTagsInput.schema';
import { TagCreateWithoutEntryTagsInputObjectSchema } from './TagCreateWithoutEntryTagsInput.schema';
import { TagUncheckedCreateWithoutEntryTagsInputObjectSchema } from './TagUncheckedCreateWithoutEntryTagsInput.schema';
import { TagWhereInputObjectSchema } from './TagWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagUpsertWithoutEntryTagsInput> = z
	.object({
		update: z.union([
			z.lazy(() => TagUpdateWithoutEntryTagsInputObjectSchema),
			z.lazy(() => TagUncheckedUpdateWithoutEntryTagsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => TagCreateWithoutEntryTagsInputObjectSchema),
			z.lazy(() => TagUncheckedCreateWithoutEntryTagsInputObjectSchema),
		]),
		where: z.lazy(() => TagWhereInputObjectSchema).optional(),
	})
	.strict();

export const TagUpsertWithoutEntryTagsInputObjectSchema = Schema;
