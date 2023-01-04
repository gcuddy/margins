import { z } from 'zod';
import { UserCreateWithoutFollowedByInputObjectSchema } from './UserCreateWithoutFollowedByInput.schema';
import { UserUncheckedCreateWithoutFollowedByInputObjectSchema } from './UserUncheckedCreateWithoutFollowedByInput.schema';
import { UserCreateOrConnectWithoutFollowedByInputObjectSchema } from './UserCreateOrConnectWithoutFollowedByInput.schema';
import { UserUpsertWithWhereUniqueWithoutFollowedByInputObjectSchema } from './UserUpsertWithWhereUniqueWithoutFollowedByInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateWithWhereUniqueWithoutFollowedByInputObjectSchema } from './UserUpdateWithWhereUniqueWithoutFollowedByInput.schema';
import { UserUpdateManyWithWhereWithoutFollowedByInputObjectSchema } from './UserUpdateManyWithWhereWithoutFollowedByInput.schema';
import { UserScalarWhereInputObjectSchema } from './UserScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateManyWithoutFollowedByNestedInput> = z
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
		upsert: z
			.union([
				z.lazy(() => UserUpsertWithWhereUniqueWithoutFollowedByInputObjectSchema),
				z.lazy(() => UserUpsertWithWhereUniqueWithoutFollowedByInputObjectSchema).array(),
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
				z.lazy(() => UserUpdateWithWhereUniqueWithoutFollowedByInputObjectSchema),
				z.lazy(() => UserUpdateWithWhereUniqueWithoutFollowedByInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => UserUpdateManyWithWhereWithoutFollowedByInputObjectSchema),
				z.lazy(() => UserUpdateManyWithWhereWithoutFollowedByInputObjectSchema).array(),
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

export const UserUpdateManyWithoutFollowedByNestedInputObjectSchema = Schema;
