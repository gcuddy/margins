import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutBookmarksInputObjectSchema } from './UserUpdateWithoutBookmarksInput.schema';
import { UserUncheckedUpdateWithoutBookmarksInputObjectSchema } from './UserUncheckedUpdateWithoutBookmarksInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutBookmarksInput> = z
	.object({
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutBookmarksInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutBookmarksInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateToOneWithWhereWithoutBookmarksInputObjectSchema = Schema;
