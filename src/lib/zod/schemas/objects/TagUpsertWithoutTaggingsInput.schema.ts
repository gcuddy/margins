import { z } from 'zod';
import { TagUpdateWithoutTaggingsInputObjectSchema } from './TagUpdateWithoutTaggingsInput.schema';
import { TagUncheckedUpdateWithoutTaggingsInputObjectSchema } from './TagUncheckedUpdateWithoutTaggingsInput.schema';
import { TagCreateWithoutTaggingsInputObjectSchema } from './TagCreateWithoutTaggingsInput.schema';
import { TagUncheckedCreateWithoutTaggingsInputObjectSchema } from './TagUncheckedCreateWithoutTaggingsInput.schema';
import { TagWhereInputObjectSchema } from './TagWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagUpsertWithoutTaggingsInput> = z
	.object({
		update: z.union([
			z.lazy(() => TagUpdateWithoutTaggingsInputObjectSchema),
			z.lazy(() => TagUncheckedUpdateWithoutTaggingsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => TagCreateWithoutTaggingsInputObjectSchema),
			z.lazy(() => TagUncheckedCreateWithoutTaggingsInputObjectSchema),
		]),
		where: z.lazy(() => TagWhereInputObjectSchema).optional(),
	})
	.strict();

export const TagUpsertWithoutTaggingsInputObjectSchema = Schema;
