import { z } from 'zod';
import { UserCreateWithoutInteractionsInputObjectSchema } from './UserCreateWithoutInteractionsInput.schema';
import { UserUncheckedCreateWithoutInteractionsInputObjectSchema } from './UserUncheckedCreateWithoutInteractionsInput.schema';
import { UserCreateOrConnectWithoutInteractionsInputObjectSchema } from './UserCreateOrConnectWithoutInteractionsInput.schema';
import { UserUpsertWithoutInteractionsInputObjectSchema } from './UserUpsertWithoutInteractionsInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutInteractionsInputObjectSchema } from './UserUpdateToOneWithWhereWithoutInteractionsInput.schema';
import { UserUpdateWithoutInteractionsInputObjectSchema } from './UserUpdateWithoutInteractionsInput.schema';
import { UserUncheckedUpdateWithoutInteractionsInputObjectSchema } from './UserUncheckedUpdateWithoutInteractionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutInteractionsNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutInteractionsInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutInteractionsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => UserCreateOrConnectWithoutInteractionsInputObjectSchema)
			.optional(),
		upsert: z.lazy(() => UserUpsertWithoutInteractionsInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutInteractionsInputObjectSchema),
				z.lazy(() => UserUpdateWithoutInteractionsInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutInteractionsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUpdateOneRequiredWithoutInteractionsNestedInputObjectSchema = Schema;
