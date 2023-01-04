import { z } from 'zod';
import { UserUpdateWithoutDefault_stateInputObjectSchema } from './UserUpdateWithoutDefault_stateInput.schema';
import { UserUncheckedUpdateWithoutDefault_stateInputObjectSchema } from './UserUncheckedUpdateWithoutDefault_stateInput.schema';
import { UserCreateWithoutDefault_stateInputObjectSchema } from './UserCreateWithoutDefault_stateInput.schema';
import { UserUncheckedCreateWithoutDefault_stateInputObjectSchema } from './UserUncheckedCreateWithoutDefault_stateInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithoutDefault_stateInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserUpdateWithoutDefault_stateInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutDefault_stateInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutDefault_stateInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutDefault_stateInputObjectSchema),
		]),
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserUpsertWithoutDefault_stateInputObjectSchema = Schema;
