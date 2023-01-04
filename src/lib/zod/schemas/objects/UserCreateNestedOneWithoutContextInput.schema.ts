import { z } from 'zod';
import { UserCreateWithoutContextInputObjectSchema } from './UserCreateWithoutContextInput.schema';
import { UserUncheckedCreateWithoutContextInputObjectSchema } from './UserUncheckedCreateWithoutContextInput.schema';
import { UserCreateOrConnectWithoutContextInputObjectSchema } from './UserCreateOrConnectWithoutContextInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateNestedOneWithoutContextInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutContextInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutContextInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutContextInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserCreateNestedOneWithoutContextInputObjectSchema = Schema;
