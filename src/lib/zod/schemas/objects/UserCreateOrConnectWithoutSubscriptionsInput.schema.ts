import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutSubscriptionsInputObjectSchema } from './UserCreateWithoutSubscriptionsInput.schema';
import { UserUncheckedCreateWithoutSubscriptionsInputObjectSchema } from './UserUncheckedCreateWithoutSubscriptionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateOrConnectWithoutSubscriptionsInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutSubscriptionsInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutSubscriptionsInputObjectSchema),
		]),
	})
	.strict();

export const UserCreateOrConnectWithoutSubscriptionsInputObjectSchema = Schema;
