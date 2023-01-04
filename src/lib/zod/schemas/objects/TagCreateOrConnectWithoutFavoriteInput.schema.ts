import { z } from 'zod';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';
import { TagCreateWithoutFavoriteInputObjectSchema } from './TagCreateWithoutFavoriteInput.schema';
import { TagUncheckedCreateWithoutFavoriteInputObjectSchema } from './TagUncheckedCreateWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagCreateOrConnectWithoutFavoriteInput> = z
	.object({
		where: z.lazy(() => TagWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => TagCreateWithoutFavoriteInputObjectSchema),
			z.lazy(() => TagUncheckedCreateWithoutFavoriteInputObjectSchema),
		]),
	})
	.strict();

export const TagCreateOrConnectWithoutFavoriteInputObjectSchema = Schema;
