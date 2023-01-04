import { z } from 'zod';
import { UserCreateWithoutFollowingInputObjectSchema } from './UserCreateWithoutFollowingInput.schema';
import { UserUncheckedCreateWithoutFollowingInputObjectSchema } from './UserUncheckedCreateWithoutFollowingInput.schema';
import { UserCreateOrConnectWithoutFollowingInputObjectSchema } from './UserCreateOrConnectWithoutFollowingInput.schema';
import { UserUpsertWithWhereUniqueWithoutFollowingInputObjectSchema } from './UserUpsertWithWhereUniqueWithoutFollowingInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateWithWhereUniqueWithoutFollowingInputObjectSchema } from './UserUpdateWithWhereUniqueWithoutFollowingInput.schema';
import { UserUpdateManyWithWhereWithoutFollowingInputObjectSchema } from './UserUpdateManyWithWhereWithoutFollowingInput.schema';
import { UserScalarWhereInputObjectSchema } from './UserScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateManyWithoutFollowingNestedInput> = z
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
		upsert: z
			.union([
				z.lazy(() => UserUpsertWithWhereUniqueWithoutFollowingInputObjectSchema),
				z.lazy(() => UserUpsertWithWhereUniqueWithoutFollowingInputObjectSchema).array(),
			])
			.optional(),
		set: z
			.union([
				z.lazy(() => UserWhereUniqueInputObjectSchema),
				z.lazy(() => UserWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => UserWhereUniqueInputObjectSchema),
				z.lazy(() => UserWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => UserWhereUniqueInputObjectSchema),
				z.lazy(() => UserWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => UserWhereUniqueInputObjectSchema),
				z.lazy(() => UserWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateWithWhereUniqueWithoutFollowingInputObjectSchema),
				z.lazy(() => UserUpdateWithWhereUniqueWithoutFollowingInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => UserUpdateManyWithWhereWithoutFollowingInputObjectSchema),
				z.lazy(() => UserUpdateManyWithWhereWithoutFollowingInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => UserScalarWhereInputObjectSchema),
				z.lazy(() => UserScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const UserUpdateManyWithoutFollowingNestedInputObjectSchema = Schema;
