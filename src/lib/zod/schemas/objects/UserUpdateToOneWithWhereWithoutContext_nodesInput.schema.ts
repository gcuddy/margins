import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutContext_nodesInputObjectSchema } from './UserUpdateWithoutContext_nodesInput.schema';
import { UserUncheckedUpdateWithoutContext_nodesInputObjectSchema } from './UserUncheckedUpdateWithoutContext_nodesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutContext_nodesInput> = z
	.object({
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutContext_nodesInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutContext_nodesInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateToOneWithWhereWithoutContext_nodesInputObjectSchema = Schema;
