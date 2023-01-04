import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutContextInputObjectSchema } from './UserCreateWithoutContextInput.schema';
import { UserUncheckedCreateWithoutContextInputObjectSchema } from './UserUncheckedCreateWithoutContextInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateOrConnectWithoutContextInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutContextInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutContextInputObjectSchema),
		]),
	})
	.strict();

export const UserCreateOrConnectWithoutContextInputObjectSchema = Schema;
