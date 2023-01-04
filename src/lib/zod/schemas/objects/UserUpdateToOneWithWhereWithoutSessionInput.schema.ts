import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutSessionInputObjectSchema } from './UserUpdateWithoutSessionInput.schema';
import { UserUncheckedUpdateWithoutSessionInputObjectSchema } from './UserUncheckedUpdateWithoutSessionInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionInput> = z
	.object({
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutSessionInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutSessionInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateToOneWithWhereWithoutSessionInputObjectSchema = Schema;
