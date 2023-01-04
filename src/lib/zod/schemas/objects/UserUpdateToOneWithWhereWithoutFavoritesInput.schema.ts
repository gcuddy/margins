import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutFavoritesInputObjectSchema } from './UserUpdateWithoutFavoritesInput.schema';
import { UserUncheckedUpdateWithoutFavoritesInputObjectSchema } from './UserUncheckedUpdateWithoutFavoritesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutFavoritesInput> = z
	.object({
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutFavoritesInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutFavoritesInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateToOneWithWhereWithoutFavoritesInputObjectSchema = Schema;
