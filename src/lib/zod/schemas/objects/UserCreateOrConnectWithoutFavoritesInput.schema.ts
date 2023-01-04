import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutFavoritesInputObjectSchema } from './UserCreateWithoutFavoritesInput.schema';
import { UserUncheckedCreateWithoutFavoritesInputObjectSchema } from './UserUncheckedCreateWithoutFavoritesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateOrConnectWithoutFavoritesInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutFavoritesInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutFavoritesInputObjectSchema),
		]),
	})
	.strict();

export const UserCreateOrConnectWithoutFavoritesInputObjectSchema = Schema;
