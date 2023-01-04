import { z } from 'zod';
import { UserCreateWithoutFavoriteFoldersInputObjectSchema } from './UserCreateWithoutFavoriteFoldersInput.schema';
import { UserUncheckedCreateWithoutFavoriteFoldersInputObjectSchema } from './UserUncheckedCreateWithoutFavoriteFoldersInput.schema';
import { UserCreateOrConnectWithoutFavoriteFoldersInputObjectSchema } from './UserCreateOrConnectWithoutFavoriteFoldersInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateNestedOneWithoutFavoriteFoldersInput> = z
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
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserCreateNestedOneWithoutFavoriteFoldersInputObjectSchema = Schema;
