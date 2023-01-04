import { z } from 'zod';
import { UserCreateWithoutContextInputObjectSchema } from './UserCreateWithoutContextInput.schema';
import { UserUncheckedCreateWithoutContextInputObjectSchema } from './UserUncheckedCreateWithoutContextInput.schema';
import { UserCreateOrConnectWithoutContextInputObjectSchema } from './UserCreateOrConnectWithoutContextInput.schema';
import { UserUpsertWithoutContextInputObjectSchema } from './UserUpsertWithoutContextInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutContextInputObjectSchema } from './UserUpdateToOneWithWhereWithoutContextInput.schema';
import { UserUpdateWithoutContextInputObjectSchema } from './UserUpdateWithoutContextInput.schema';
import { UserUncheckedUpdateWithoutContextInputObjectSchema } from './UserUncheckedUpdateWithoutContextInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutContextNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutContextInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutContextInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutContextInputObjectSchema).optional(),
		upsert: z.lazy(() => UserUpsertWithoutContextInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutContextInputObjectSchema),
				z.lazy(() => UserUpdateWithoutContextInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutContextInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUpdateOneRequiredWithoutContextNestedInputObjectSchema = Schema;
