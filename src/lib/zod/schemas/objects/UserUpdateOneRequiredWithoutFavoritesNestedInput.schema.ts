import { z } from 'zod';
import { UserCreateWithoutFavoritesInputObjectSchema } from './UserCreateWithoutFavoritesInput.schema';
import { UserUncheckedCreateWithoutFavoritesInputObjectSchema } from './UserUncheckedCreateWithoutFavoritesInput.schema';
import { UserCreateOrConnectWithoutFavoritesInputObjectSchema } from './UserCreateOrConnectWithoutFavoritesInput.schema';
import { UserUpsertWithoutFavoritesInputObjectSchema } from './UserUpsertWithoutFavoritesInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutFavoritesInputObjectSchema } from './UserUpdateToOneWithWhereWithoutFavoritesInput.schema';
import { UserUpdateWithoutFavoritesInputObjectSchema } from './UserUpdateWithoutFavoritesInput.schema';
import { UserUncheckedUpdateWithoutFavoritesInputObjectSchema } from './UserUncheckedUpdateWithoutFavoritesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutFavoritesNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutFavoritesInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutFavoritesInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFavoritesInputObjectSchema).optional(),
		upsert: z.lazy(() => UserUpsertWithoutFavoritesInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutFavoritesInputObjectSchema),
				z.lazy(() => UserUpdateWithoutFavoritesInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutFavoritesInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUpdateOneRequiredWithoutFavoritesNestedInputObjectSchema = Schema;
