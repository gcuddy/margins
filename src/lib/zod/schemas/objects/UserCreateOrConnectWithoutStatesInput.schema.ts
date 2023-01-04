import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutStatesInputObjectSchema } from './UserCreateWithoutStatesInput.schema';
import { UserUncheckedCreateWithoutStatesInputObjectSchema } from './UserUncheckedCreateWithoutStatesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateOrConnectWithoutStatesInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutStatesInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutStatesInputObjectSchema),
		]),
	})
	.strict();

export const UserCreateOrConnectWithoutStatesInputObjectSchema = Schema;
