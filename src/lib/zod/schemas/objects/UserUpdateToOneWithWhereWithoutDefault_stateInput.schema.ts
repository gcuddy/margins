import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutDefault_stateInputObjectSchema } from './UserUpdateWithoutDefault_stateInput.schema';
import { UserUncheckedUpdateWithoutDefault_stateInputObjectSchema } from './UserUncheckedUpdateWithoutDefault_stateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutDefault_stateInput> = z
	.object({
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutDefault_stateInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutDefault_stateInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateToOneWithWhereWithoutDefault_stateInputObjectSchema = Schema;
