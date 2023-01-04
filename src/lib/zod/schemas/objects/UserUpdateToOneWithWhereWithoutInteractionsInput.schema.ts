import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutInteractionsInputObjectSchema } from './UserUpdateWithoutInteractionsInput.schema';
import { UserUncheckedUpdateWithoutInteractionsInputObjectSchema } from './UserUncheckedUpdateWithoutInteractionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutInteractionsInput> = z
	.object({
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutInteractionsInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutInteractionsInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateToOneWithWhereWithoutInteractionsInputObjectSchema = Schema;
