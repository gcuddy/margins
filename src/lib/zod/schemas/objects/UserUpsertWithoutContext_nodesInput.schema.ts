import { z } from 'zod';
import { UserUpdateWithoutContext_nodesInputObjectSchema } from './UserUpdateWithoutContext_nodesInput.schema';
import { UserUncheckedUpdateWithoutContext_nodesInputObjectSchema } from './UserUncheckedUpdateWithoutContext_nodesInput.schema';
import { UserCreateWithoutContext_nodesInputObjectSchema } from './UserCreateWithoutContext_nodesInput.schema';
import { UserUncheckedCreateWithoutContext_nodesInputObjectSchema } from './UserUncheckedCreateWithoutContext_nodesInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithoutContext_nodesInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserUpdateWithoutContext_nodesInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutContext_nodesInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutContext_nodesInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutContext_nodesInputObjectSchema),
		]),
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserUpsertWithoutContext_nodesInputObjectSchema = Schema;
