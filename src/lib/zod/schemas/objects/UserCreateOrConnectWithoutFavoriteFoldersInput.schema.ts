import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutFavoriteFoldersInputObjectSchema } from './UserCreateWithoutFavoriteFoldersInput.schema';
import { UserUncheckedCreateWithoutFavoriteFoldersInputObjectSchema } from './UserUncheckedCreateWithoutFavoriteFoldersInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateOrConnectWithoutFavoriteFoldersInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutFavoriteFoldersInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutFavoriteFoldersInputObjectSchema),
		]),
	})
	.strict();

export const UserCreateOrConnectWithoutFavoriteFoldersInputObjectSchema = Schema;
