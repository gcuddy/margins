import { z } from 'zod';
import { UserCreateWithoutFavoriteFoldersInputObjectSchema } from './UserCreateWithoutFavoriteFoldersInput.schema';
import { UserUncheckedCreateWithoutFavoriteFoldersInputObjectSchema } from './UserUncheckedCreateWithoutFavoriteFoldersInput.schema';
import { UserCreateOrConnectWithoutFavoriteFoldersInputObjectSchema } from './UserCreateOrConnectWithoutFavoriteFoldersInput.schema';
import { UserUpsertWithoutFavoriteFoldersInputObjectSchema } from './UserUpsertWithoutFavoriteFoldersInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutFavoriteFoldersInputObjectSchema } from './UserUpdateToOneWithWhereWithoutFavoriteFoldersInput.schema';
import { UserUpdateWithoutFavoriteFoldersInputObjectSchema } from './UserUpdateWithoutFavoriteFoldersInput.schema';
import { UserUncheckedUpdateWithoutFavoriteFoldersInputObjectSchema } from './UserUncheckedUpdateWithoutFavoriteFoldersInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutFavoriteFoldersNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutFavoriteFoldersInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutFavoriteFoldersInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => UserCreateOrConnectWithoutFavoriteFoldersInputObjectSchema)
			.optional(),
		upsert: z.lazy(() => UserUpsertWithoutFavoriteFoldersInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutFavoriteFoldersInputObjectSchema),
				z.lazy(() => UserUpdateWithoutFavoriteFoldersInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutFavoriteFoldersInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUpdateOneRequiredWithoutFavoriteFoldersNestedInputObjectSchema = Schema;
