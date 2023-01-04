import { z } from 'zod';
import { TagWhereInputObjectSchema } from './TagWhereInput.schema';
import { TagUpdateWithoutTaggingsInputObjectSchema } from './TagUpdateWithoutTaggingsInput.schema';
import { TagUncheckedUpdateWithoutTaggingsInputObjectSchema } from './TagUncheckedUpdateWithoutTaggingsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagUpdateToOneWithWhereWithoutTaggingsInput> = z
	.object({
		where: z.lazy(() => TagWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => TagUpdateWithoutTaggingsInputObjectSchema),
			z.lazy(() => TagUncheckedUpdateWithoutTaggingsInputObjectSchema),
		]),
	})
	.strict();

export const TagUpdateToOneWithWhereWithoutTaggingsInputObjectSchema = Schema;
