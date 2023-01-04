import { z } from 'zod';
import { UserCreateWithoutStatesInputObjectSchema } from './UserCreateWithoutStatesInput.schema';
import { UserUncheckedCreateWithoutStatesInputObjectSchema } from './UserUncheckedCreateWithoutStatesInput.schema';
import { UserCreateOrConnectWithoutStatesInputObjectSchema } from './UserCreateOrConnectWithoutStatesInput.schema';
import { UserUpsertWithoutStatesInputObjectSchema } from './UserUpsertWithoutStatesInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutStatesInputObjectSchema } from './UserUpdateToOneWithWhereWithoutStatesInput.schema';
import { UserUpdateWithoutStatesInputObjectSchema } from './UserUpdateWithoutStatesInput.schema';
import { UserUncheckedUpdateWithoutStatesInputObjectSchema } from './UserUncheckedUpdateWithoutStatesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutStatesNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutStatesInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutStatesInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutStatesInputObjectSchema).optional(),
		upsert: z.lazy(() => UserUpsertWithoutStatesInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutStatesInputObjectSchema),
				z.lazy(() => UserUpdateWithoutStatesInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutStatesInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUpdateOneRequiredWithoutStatesNestedInputObjectSchema = Schema;
