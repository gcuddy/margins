import { z } from 'zod';
import { UserCreateWithoutSubscriptionsInputObjectSchema } from './UserCreateWithoutSubscriptionsInput.schema';
import { UserUncheckedCreateWithoutSubscriptionsInputObjectSchema } from './UserUncheckedCreateWithoutSubscriptionsInput.schema';
import { UserCreateOrConnectWithoutSubscriptionsInputObjectSchema } from './UserCreateOrConnectWithoutSubscriptionsInput.schema';
import { UserUpsertWithoutSubscriptionsInputObjectSchema } from './UserUpsertWithoutSubscriptionsInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutSubscriptionsInputObjectSchema } from './UserUpdateToOneWithWhereWithoutSubscriptionsInput.schema';
import { UserUpdateWithoutSubscriptionsInputObjectSchema } from './UserUpdateWithoutSubscriptionsInput.schema';
import { UserUncheckedUpdateWithoutSubscriptionsInputObjectSchema } from './UserUncheckedUpdateWithoutSubscriptionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSubscriptionsNestedInput> = z
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
		upsert: z.lazy(() => UserUpsertWithoutSubscriptionsInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutSubscriptionsInputObjectSchema),
				z.lazy(() => UserUpdateWithoutSubscriptionsInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutSubscriptionsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUpdateOneRequiredWithoutSubscriptionsNestedInputObjectSchema = Schema;
