import { z } from 'zod';
import { UserCreateWithoutDefault_stateInputObjectSchema } from './UserCreateWithoutDefault_stateInput.schema';
import { UserUncheckedCreateWithoutDefault_stateInputObjectSchema } from './UserUncheckedCreateWithoutDefault_stateInput.schema';
import { UserCreateOrConnectWithoutDefault_stateInputObjectSchema } from './UserCreateOrConnectWithoutDefault_stateInput.schema';
import { UserUpsertWithoutDefault_stateInputObjectSchema } from './UserUpsertWithoutDefault_stateInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutDefault_stateInputObjectSchema } from './UserUpdateToOneWithWhereWithoutDefault_stateInput.schema';
import { UserUpdateWithoutDefault_stateInputObjectSchema } from './UserUpdateWithoutDefault_stateInput.schema';
import { UserUncheckedUpdateWithoutDefault_stateInputObjectSchema } from './UserUncheckedUpdateWithoutDefault_stateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUncheckedUpdateOneWithoutDefault_stateNestedInput> = z
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
		upsert: z.lazy(() => UserUpsertWithoutDefault_stateInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutDefault_stateInputObjectSchema),
				z.lazy(() => UserUpdateWithoutDefault_stateInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutDefault_stateInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUncheckedUpdateOneWithoutDefault_stateNestedInputObjectSchema = Schema;
