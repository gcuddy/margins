import { z } from 'zod';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteCreateWithoutSmartListInputObjectSchema } from './FavoriteCreateWithoutSmartListInput.schema';
import { FavoriteUncheckedCreateWithoutSmartListInputObjectSchema } from './FavoriteUncheckedCreateWithoutSmartListInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteCreateOrConnectWithoutSmartListInput> = z
	.object({
		where: z.lazy(() => FavoriteWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => FavoriteCreateWithoutSmartListInputObjectSchema),
			z.lazy(() => FavoriteUncheckedCreateWithoutSmartListInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteCreateOrConnectWithoutSmartListInputObjectSchema = Schema;
