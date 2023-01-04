import { z } from 'zod';
import { UserCreateWithoutStatesInputObjectSchema } from './UserCreateWithoutStatesInput.schema';
import { UserUncheckedCreateWithoutStatesInputObjectSchema } from './UserUncheckedCreateWithoutStatesInput.schema';
import { UserCreateOrConnectWithoutStatesInputObjectSchema } from './UserCreateOrConnectWithoutStatesInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateNestedOneWithoutStatesInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutStatesInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutStatesInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutStatesInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserCreateNestedOneWithoutStatesInputObjectSchema = Schema;
