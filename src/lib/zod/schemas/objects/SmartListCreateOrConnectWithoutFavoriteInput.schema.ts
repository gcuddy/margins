import { z } from 'zod';
import { SmartListWhereUniqueInputObjectSchema } from './SmartListWhereUniqueInput.schema';
import { SmartListCreateWithoutFavoriteInputObjectSchema } from './SmartListCreateWithoutFavoriteInput.schema';
import { SmartListUncheckedCreateWithoutFavoriteInputObjectSchema } from './SmartListUncheckedCreateWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SmartListCreateOrConnectWithoutFavoriteInput> = z
	.object({
		where: z.lazy(() => SmartListWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => SmartListCreateWithoutFavoriteInputObjectSchema),
			z.lazy(() => SmartListUncheckedCreateWithoutFavoriteInputObjectSchema),
		]),
	})
	.strict();

export const SmartListCreateOrConnectWithoutFavoriteInputObjectSchema = Schema;
