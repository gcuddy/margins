import { z } from 'zod';
import { UserCreateWithoutContext_nodesInputObjectSchema } from './UserCreateWithoutContext_nodesInput.schema';
import { UserUncheckedCreateWithoutContext_nodesInputObjectSchema } from './UserUncheckedCreateWithoutContext_nodesInput.schema';
import { UserCreateOrConnectWithoutContext_nodesInputObjectSchema } from './UserCreateOrConnectWithoutContext_nodesInput.schema';
import { UserUpsertWithoutContext_nodesInputObjectSchema } from './UserUpsertWithoutContext_nodesInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutContext_nodesInputObjectSchema } from './UserUpdateToOneWithWhereWithoutContext_nodesInput.schema';
import { UserUpdateWithoutContext_nodesInputObjectSchema } from './UserUpdateWithoutContext_nodesInput.schema';
import { UserUncheckedUpdateWithoutContext_nodesInputObjectSchema } from './UserUncheckedUpdateWithoutContext_nodesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutContext_nodesNestedInput> = z
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
		upsert: z.lazy(() => UserUpsertWithoutContext_nodesInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutContext_nodesInputObjectSchema),
				z.lazy(() => UserUpdateWithoutContext_nodesInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutContext_nodesInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUpdateOneRequiredWithoutContext_nodesNestedInputObjectSchema = Schema;
