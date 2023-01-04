import { z } from 'zod';
import { UserUpdateWithoutFavoriteFoldersInputObjectSchema } from './UserUpdateWithoutFavoriteFoldersInput.schema';
import { UserUncheckedUpdateWithoutFavoriteFoldersInputObjectSchema } from './UserUncheckedUpdateWithoutFavoriteFoldersInput.schema';
import { UserCreateWithoutFavoriteFoldersInputObjectSchema } from './UserCreateWithoutFavoriteFoldersInput.schema';
import { UserUncheckedCreateWithoutFavoriteFoldersInputObjectSchema } from './UserUncheckedCreateWithoutFavoriteFoldersInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithoutFavoriteFoldersInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserUpdateWithoutFavoriteFoldersInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutFavoriteFoldersInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutFavoriteFoldersInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutFavoriteFoldersInputObjectSchema),
		]),
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserUpsertWithoutFavoriteFoldersInputObjectSchema = Schema;
