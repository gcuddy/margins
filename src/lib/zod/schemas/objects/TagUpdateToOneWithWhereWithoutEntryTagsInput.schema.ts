import { z } from 'zod';
import { TagWhereInputObjectSchema } from './TagWhereInput.schema';
import { TagUpdateWithoutEntryTagsInputObjectSchema } from './TagUpdateWithoutEntryTagsInput.schema';
import { TagUncheckedUpdateWithoutEntryTagsInputObjectSchema } from './TagUncheckedUpdateWithoutEntryTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagUpdateToOneWithWhereWithoutEntryTagsInput> = z
	.object({
		where: z.lazy(() => TagWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => TagUpdateWithoutEntryTagsInputObjectSchema),
			z.lazy(() => TagUncheckedUpdateWithoutEntryTagsInputObjectSchema),
		]),
	})
	.strict();

export const TagUpdateToOneWithWhereWithoutEntryTagsInputObjectSchema = Schema;
