import { z } from 'zod';
import { UserCreateWithoutSessionInputObjectSchema } from './UserCreateWithoutSessionInput.schema';
import { UserUncheckedCreateWithoutSessionInputObjectSchema } from './UserUncheckedCreateWithoutSessionInput.schema';
import { UserCreateOrConnectWithoutSessionInputObjectSchema } from './UserCreateOrConnectWithoutSessionInput.schema';
import { UserUpsertWithoutSessionInputObjectSchema } from './UserUpsertWithoutSessionInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutSessionInputObjectSchema } from './UserUpdateToOneWithWhereWithoutSessionInput.schema';
import { UserUpdateWithoutSessionInputObjectSchema } from './UserUpdateWithoutSessionInput.schema';
import { UserUncheckedUpdateWithoutSessionInputObjectSchema } from './UserUncheckedUpdateWithoutSessionInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutSessionInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutSessionInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionInputObjectSchema).optional(),
		upsert: z.lazy(() => UserUpsertWithoutSessionInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutSessionInputObjectSchema),
				z.lazy(() => UserUpdateWithoutSessionInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutSessionInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUpdateOneRequiredWithoutSessionNestedInputObjectSchema = Schema;
