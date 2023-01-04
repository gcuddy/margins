import { z } from 'zod';
import { UserCreateWithoutInteractionsInputObjectSchema } from './UserCreateWithoutInteractionsInput.schema';
import { UserUncheckedCreateWithoutInteractionsInputObjectSchema } from './UserUncheckedCreateWithoutInteractionsInput.schema';
import { UserCreateOrConnectWithoutInteractionsInputObjectSchema } from './UserCreateOrConnectWithoutInteractionsInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateNestedOneWithoutInteractionsInput> = z
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
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserCreateNestedOneWithoutInteractionsInputObjectSchema = Schema;
