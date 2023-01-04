import { z } from 'zod';
import { SmartListWhereInputObjectSchema } from './SmartListWhereInput.schema';
import { SmartListUpdateWithoutFavoriteInputObjectSchema } from './SmartListUpdateWithoutFavoriteInput.schema';
import { SmartListUncheckedUpdateWithoutFavoriteInputObjectSchema } from './SmartListUncheckedUpdateWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SmartListUpdateToOneWithWhereWithoutFavoriteInput> = z
	.object({
		where: z.lazy(() => SmartListWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => SmartListUpdateWithoutFavoriteInputObjectSchema),
			z.lazy(() => SmartListUncheckedUpdateWithoutFavoriteInputObjectSchema),
		]),
	})
	.strict();

export const SmartListUpdateToOneWithWhereWithoutFavoriteInputObjectSchema = Schema;
