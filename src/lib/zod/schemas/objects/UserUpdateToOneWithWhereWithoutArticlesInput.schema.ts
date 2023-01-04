import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutArticlesInputObjectSchema } from './UserUpdateWithoutArticlesInput.schema';
import { UserUncheckedUpdateWithoutArticlesInputObjectSchema } from './UserUncheckedUpdateWithoutArticlesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutArticlesInput> = z
	.object({
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutArticlesInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutArticlesInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateToOneWithWhereWithoutArticlesInputObjectSchema = Schema;
