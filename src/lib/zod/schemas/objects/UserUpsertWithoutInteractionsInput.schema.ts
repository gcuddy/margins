import { z } from 'zod';
import { UserUpdateWithoutInteractionsInputObjectSchema } from './UserUpdateWithoutInteractionsInput.schema';
import { UserUncheckedUpdateWithoutInteractionsInputObjectSchema } from './UserUncheckedUpdateWithoutInteractionsInput.schema';
import { UserCreateWithoutInteractionsInputObjectSchema } from './UserCreateWithoutInteractionsInput.schema';
import { UserUncheckedCreateWithoutInteractionsInputObjectSchema } from './UserUncheckedCreateWithoutInteractionsInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithoutInteractionsInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserUpdateWithoutInteractionsInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutInteractionsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutInteractionsInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutInteractionsInputObjectSchema),
		]),
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserUpsertWithoutInteractionsInputObjectSchema = Schema;
