import { z } from 'zod';
import { UserCreateWithoutSubscriptionsInputObjectSchema } from './UserCreateWithoutSubscriptionsInput.schema';
import { UserUncheckedCreateWithoutSubscriptionsInputObjectSchema } from './UserUncheckedCreateWithoutSubscriptionsInput.schema';
import { UserCreateOrConnectWithoutSubscriptionsInputObjectSchema } from './UserCreateOrConnectWithoutSubscriptionsInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateNestedOneWithoutSubscriptionsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutSubscriptionsInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutSubscriptionsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => UserCreateOrConnectWithoutSubscriptionsInputObjectSchema)
			.optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserCreateNestedOneWithoutSubscriptionsInputObjectSchema = Schema;
