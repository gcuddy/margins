import { z } from 'zod';
import { TagWhereInputObjectSchema } from './TagWhereInput.schema';
import { TagUpdateWithoutFavoriteInputObjectSchema } from './TagUpdateWithoutFavoriteInput.schema';
import { TagUncheckedUpdateWithoutFavoriteInputObjectSchema } from './TagUncheckedUpdateWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagUpdateToOneWithWhereWithoutFavoriteInput> = z
	.object({
		where: z.lazy(() => TagWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => TagUpdateWithoutFavoriteInputObjectSchema),
			z.lazy(() => TagUncheckedUpdateWithoutFavoriteInputObjectSchema),
		]),
	})
	.strict();

export const TagUpdateToOneWithWhereWithoutFavoriteInputObjectSchema = Schema;
