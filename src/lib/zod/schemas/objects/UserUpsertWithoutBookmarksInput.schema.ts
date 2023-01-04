import { z } from 'zod';
import { UserUpdateWithoutBookmarksInputObjectSchema } from './UserUpdateWithoutBookmarksInput.schema';
import { UserUncheckedUpdateWithoutBookmarksInputObjectSchema } from './UserUncheckedUpdateWithoutBookmarksInput.schema';
import { UserCreateWithoutBookmarksInputObjectSchema } from './UserCreateWithoutBookmarksInput.schema';
import { UserUncheckedCreateWithoutBookmarksInputObjectSchema } from './UserUncheckedCreateWithoutBookmarksInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithoutBookmarksInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserUpdateWithoutBookmarksInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutBookmarksInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutBookmarksInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutBookmarksInputObjectSchema),
		]),
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserUpsertWithoutBookmarksInputObjectSchema = Schema;
