import { z } from 'zod';
import { UserUpdateWithoutSessionInputObjectSchema } from './UserUpdateWithoutSessionInput.schema';
import { UserUncheckedUpdateWithoutSessionInputObjectSchema } from './UserUncheckedUpdateWithoutSessionInput.schema';
import { UserCreateWithoutSessionInputObjectSchema } from './UserCreateWithoutSessionInput.schema';
import { UserUncheckedCreateWithoutSessionInputObjectSchema } from './UserUncheckedCreateWithoutSessionInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithoutSessionInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserUpdateWithoutSessionInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutSessionInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutSessionInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutSessionInputObjectSchema),
		]),
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserUpsertWithoutSessionInputObjectSchema = Schema;
