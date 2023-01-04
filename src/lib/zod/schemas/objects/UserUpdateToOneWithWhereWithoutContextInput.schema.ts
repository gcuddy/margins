import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutContextInputObjectSchema } from './UserUpdateWithoutContextInput.schema';
import { UserUncheckedUpdateWithoutContextInputObjectSchema } from './UserUncheckedUpdateWithoutContextInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutContextInput> = z
	.object({
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutContextInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutContextInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateToOneWithWhereWithoutContextInputObjectSchema = Schema;
