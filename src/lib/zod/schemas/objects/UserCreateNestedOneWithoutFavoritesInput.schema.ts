import { z } from 'zod';
import { UserCreateWithoutFavoritesInputObjectSchema } from './UserCreateWithoutFavoritesInput.schema';
import { UserUncheckedCreateWithoutFavoritesInputObjectSchema } from './UserUncheckedCreateWithoutFavoritesInput.schema';
import { UserCreateOrConnectWithoutFavoritesInputObjectSchema } from './UserCreateOrConnectWithoutFavoritesInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateNestedOneWithoutFavoritesInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutFavoritesInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutFavoritesInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFavoritesInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserCreateNestedOneWithoutFavoritesInputObjectSchema = Schema;
