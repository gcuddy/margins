import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutFavoriteFoldersInputObjectSchema } from './UserUpdateWithoutFavoriteFoldersInput.schema';
import { UserUncheckedUpdateWithoutFavoriteFoldersInputObjectSchema } from './UserUncheckedUpdateWithoutFavoriteFoldersInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutFavoriteFoldersInput> = z
	.object({
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutFavoriteFoldersInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutFavoriteFoldersInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateToOneWithWhereWithoutFavoriteFoldersInputObjectSchema = Schema;
