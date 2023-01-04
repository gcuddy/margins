import { z } from 'zod';
import { UserUpdateWithoutContextInputObjectSchema } from './UserUpdateWithoutContextInput.schema';
import { UserUncheckedUpdateWithoutContextInputObjectSchema } from './UserUncheckedUpdateWithoutContextInput.schema';
import { UserCreateWithoutContextInputObjectSchema } from './UserCreateWithoutContextInput.schema';
import { UserUncheckedCreateWithoutContextInputObjectSchema } from './UserUncheckedCreateWithoutContextInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithoutContextInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserUpdateWithoutContextInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutContextInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutContextInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutContextInputObjectSchema),
		]),
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserUpsertWithoutContextInputObjectSchema = Schema;
