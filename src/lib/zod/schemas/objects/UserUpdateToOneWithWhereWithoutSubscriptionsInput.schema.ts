import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutSubscriptionsInputObjectSchema } from './UserUpdateWithoutSubscriptionsInput.schema';
import { UserUncheckedUpdateWithoutSubscriptionsInputObjectSchema } from './UserUncheckedUpdateWithoutSubscriptionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSubscriptionsInput> = z
	.object({
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutSubscriptionsInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutSubscriptionsInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateToOneWithWhereWithoutSubscriptionsInputObjectSchema = Schema;
