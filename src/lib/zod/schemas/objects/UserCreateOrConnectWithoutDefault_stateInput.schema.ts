import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutDefault_stateInputObjectSchema } from './UserCreateWithoutDefault_stateInput.schema';
import { UserUncheckedCreateWithoutDefault_stateInputObjectSchema } from './UserUncheckedCreateWithoutDefault_stateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateOrConnectWithoutDefault_stateInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutDefault_stateInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutDefault_stateInputObjectSchema),
		]),
	})
	.strict();

export const UserCreateOrConnectWithoutDefault_stateInputObjectSchema = Schema;
