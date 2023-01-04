import { z } from 'zod';
import { UserUpdateWithoutStatesInputObjectSchema } from './UserUpdateWithoutStatesInput.schema';
import { UserUncheckedUpdateWithoutStatesInputObjectSchema } from './UserUncheckedUpdateWithoutStatesInput.schema';
import { UserCreateWithoutStatesInputObjectSchema } from './UserCreateWithoutStatesInput.schema';
import { UserUncheckedCreateWithoutStatesInputObjectSchema } from './UserUncheckedCreateWithoutStatesInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithoutStatesInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserUpdateWithoutStatesInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutStatesInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutStatesInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutStatesInputObjectSchema),
		]),
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserUpsertWithoutStatesInputObjectSchema = Schema;
