import { z } from 'zod';
import { UserUpdateWithoutArticlesInputObjectSchema } from './UserUpdateWithoutArticlesInput.schema';
import { UserUncheckedUpdateWithoutArticlesInputObjectSchema } from './UserUncheckedUpdateWithoutArticlesInput.schema';
import { UserCreateWithoutArticlesInputObjectSchema } from './UserCreateWithoutArticlesInput.schema';
import { UserUncheckedCreateWithoutArticlesInputObjectSchema } from './UserUncheckedCreateWithoutArticlesInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithoutArticlesInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserUpdateWithoutArticlesInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutArticlesInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutArticlesInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutArticlesInputObjectSchema),
		]),
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserUpsertWithoutArticlesInputObjectSchema = Schema;
