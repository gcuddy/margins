import { z } from 'zod';
import { SmartListUpdateWithoutFavoriteInputObjectSchema } from './SmartListUpdateWithoutFavoriteInput.schema';
import { SmartListUncheckedUpdateWithoutFavoriteInputObjectSchema } from './SmartListUncheckedUpdateWithoutFavoriteInput.schema';
import { SmartListCreateWithoutFavoriteInputObjectSchema } from './SmartListCreateWithoutFavoriteInput.schema';
import { SmartListUncheckedCreateWithoutFavoriteInputObjectSchema } from './SmartListUncheckedCreateWithoutFavoriteInput.schema';
import { SmartListWhereInputObjectSchema } from './SmartListWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SmartListUpsertWithoutFavoriteInput> = z
	.object({
		update: z.union([
			z.lazy(() => SmartListUpdateWithoutFavoriteInputObjectSchema),
			z.lazy(() => SmartListUncheckedUpdateWithoutFavoriteInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => SmartListCreateWithoutFavoriteInputObjectSchema),
			z.lazy(() => SmartListUncheckedCreateWithoutFavoriteInputObjectSchema),
		]),
		where: z.lazy(() => SmartListWhereInputObjectSchema).optional(),
	})
	.strict();

export const SmartListUpsertWithoutFavoriteInputObjectSchema = Schema;
