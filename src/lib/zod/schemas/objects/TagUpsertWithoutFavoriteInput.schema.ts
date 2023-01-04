import { z } from 'zod';
import { TagUpdateWithoutFavoriteInputObjectSchema } from './TagUpdateWithoutFavoriteInput.schema';
import { TagUncheckedUpdateWithoutFavoriteInputObjectSchema } from './TagUncheckedUpdateWithoutFavoriteInput.schema';
import { TagCreateWithoutFavoriteInputObjectSchema } from './TagCreateWithoutFavoriteInput.schema';
import { TagUncheckedCreateWithoutFavoriteInputObjectSchema } from './TagUncheckedCreateWithoutFavoriteInput.schema';
import { TagWhereInputObjectSchema } from './TagWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagUpsertWithoutFavoriteInput> = z
	.object({
		update: z.union([
			z.lazy(() => TagUpdateWithoutFavoriteInputObjectSchema),
			z.lazy(() => TagUncheckedUpdateWithoutFavoriteInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => TagCreateWithoutFavoriteInputObjectSchema),
			z.lazy(() => TagUncheckedCreateWithoutFavoriteInputObjectSchema),
		]),
		where: z.lazy(() => TagWhereInputObjectSchema).optional(),
	})
	.strict();

export const TagUpsertWithoutFavoriteInputObjectSchema = Schema;
