import { z } from 'zod';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteCreateWithoutBookmarkInputObjectSchema } from './FavoriteCreateWithoutBookmarkInput.schema';
import { FavoriteUncheckedCreateWithoutBookmarkInputObjectSchema } from './FavoriteUncheckedCreateWithoutBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteCreateOrConnectWithoutBookmarkInput> = z
	.object({
		where: z.lazy(() => FavoriteWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => FavoriteCreateWithoutBookmarkInputObjectSchema),
			z.lazy(() => FavoriteUncheckedCreateWithoutBookmarkInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteCreateOrConnectWithoutBookmarkInputObjectSchema = Schema;
