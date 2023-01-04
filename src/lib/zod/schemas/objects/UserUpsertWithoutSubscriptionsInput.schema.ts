import { z } from 'zod';
import { UserUpdateWithoutSubscriptionsInputObjectSchema } from './UserUpdateWithoutSubscriptionsInput.schema';
import { UserUncheckedUpdateWithoutSubscriptionsInputObjectSchema } from './UserUncheckedUpdateWithoutSubscriptionsInput.schema';
import { UserCreateWithoutSubscriptionsInputObjectSchema } from './UserCreateWithoutSubscriptionsInput.schema';
import { UserUncheckedCreateWithoutSubscriptionsInputObjectSchema } from './UserUncheckedCreateWithoutSubscriptionsInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithoutSubscriptionsInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserUpdateWithoutSubscriptionsInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutSubscriptionsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutSubscriptionsInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutSubscriptionsInputObjectSchema),
		]),
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserUpsertWithoutSubscriptionsInputObjectSchema = Schema;
