import { z } from 'zod';
import { UserCreateWithoutDefault_stateInputObjectSchema } from './UserCreateWithoutDefault_stateInput.schema';
import { UserUncheckedCreateWithoutDefault_stateInputObjectSchema } from './UserUncheckedCreateWithoutDefault_stateInput.schema';
import { UserCreateOrConnectWithoutDefault_stateInputObjectSchema } from './UserCreateOrConnectWithoutDefault_stateInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUncheckedCreateNestedOneWithoutDefault_stateInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutDefault_stateInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutDefault_stateInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => UserCreateOrConnectWithoutDefault_stateInputObjectSchema)
			.optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserUncheckedCreateNestedOneWithoutDefault_stateInputObjectSchema = Schema;
