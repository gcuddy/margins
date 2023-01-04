import { z } from 'zod';
import { UserCreateWithoutContext_nodesInputObjectSchema } from './UserCreateWithoutContext_nodesInput.schema';
import { UserUncheckedCreateWithoutContext_nodesInputObjectSchema } from './UserUncheckedCreateWithoutContext_nodesInput.schema';
import { UserCreateOrConnectWithoutContext_nodesInputObjectSchema } from './UserCreateOrConnectWithoutContext_nodesInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateNestedOneWithoutContext_nodesInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutContext_nodesInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutContext_nodesInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => UserCreateOrConnectWithoutContext_nodesInputObjectSchema)
			.optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserCreateNestedOneWithoutContext_nodesInputObjectSchema = Schema;
