import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutStatesInputObjectSchema } from './UserUpdateWithoutStatesInput.schema';
import { UserUncheckedUpdateWithoutStatesInputObjectSchema } from './UserUncheckedUpdateWithoutStatesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutStatesInput> = z
	.object({
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutStatesInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutStatesInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateToOneWithWhereWithoutStatesInputObjectSchema = Schema;
