import { z } from 'zod';
import { UserCreateWithoutFollowingInputObjectSchema } from './UserCreateWithoutFollowingInput.schema';
import { UserUncheckedCreateWithoutFollowingInputObjectSchema } from './UserUncheckedCreateWithoutFollowingInput.schema';
import { UserCreateOrConnectWithoutFollowingInputObjectSchema } from './UserCreateOrConnectWithoutFollowingInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateNestedManyWithoutFollowingInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutFollowingInputObjectSchema),
				z.lazy(() => UserCreateWithoutFollowingInputObjectSchema).array(),
				z.lazy(() => UserUncheckedCreateWithoutFollowingInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutFollowingInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => UserCreateOrConnectWithoutFollowingInputObjectSchema),
				z.lazy(() => UserCreateOrConnectWithoutFollowingInputObjectSchema).array(),
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

export const UserCreateNestedManyWithoutFollowingInputObjectSchema = Schema;
