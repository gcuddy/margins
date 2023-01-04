import { z } from 'zod';
import { UserCreateWithoutFollowedByInputObjectSchema } from './UserCreateWithoutFollowedByInput.schema';
import { UserUncheckedCreateWithoutFollowedByInputObjectSchema } from './UserUncheckedCreateWithoutFollowedByInput.schema';
import { UserCreateOrConnectWithoutFollowedByInputObjectSchema } from './UserCreateOrConnectWithoutFollowedByInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutFollowedByInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutFollowedByInputObjectSchema),
				z.lazy(() => UserCreateWithoutFollowedByInputObjectSchema).array(),
				z.lazy(() => UserUncheckedCreateWithoutFollowedByInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutFollowedByInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => UserCreateOrConnectWithoutFollowedByInputObjectSchema),
				z.lazy(() => UserCreateOrConnectWithoutFollowedByInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => UserWhereUniqueInputObjectSchema),
				z.lazy(() => UserWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const UserUncheckedCreateNestedManyWithoutFollowedByInputObjectSchema = Schema;
