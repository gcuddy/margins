import { z } from 'zod';
import { UserCreateWithoutSessionInputObjectSchema } from './UserCreateWithoutSessionInput.schema';
import { UserUncheckedCreateWithoutSessionInputObjectSchema } from './UserUncheckedCreateWithoutSessionInput.schema';
import { UserCreateOrConnectWithoutSessionInputObjectSchema } from './UserCreateOrConnectWithoutSessionInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutSessionInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutSessionInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserCreateNestedOneWithoutSessionInputObjectSchema = Schema;
