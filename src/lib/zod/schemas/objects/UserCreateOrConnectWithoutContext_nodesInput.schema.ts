import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutContext_nodesInputObjectSchema } from './UserCreateWithoutContext_nodesInput.schema';
import { UserUncheckedCreateWithoutContext_nodesInputObjectSchema } from './UserUncheckedCreateWithoutContext_nodesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateOrConnectWithoutContext_nodesInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutContext_nodesInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutContext_nodesInputObjectSchema),
		]),
	})
	.strict();

export const UserCreateOrConnectWithoutContext_nodesInputObjectSchema = Schema;
