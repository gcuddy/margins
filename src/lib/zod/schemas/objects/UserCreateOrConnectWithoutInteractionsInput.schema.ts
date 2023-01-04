import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutInteractionsInputObjectSchema } from './UserCreateWithoutInteractionsInput.schema';
import { UserUncheckedCreateWithoutInteractionsInputObjectSchema } from './UserUncheckedCreateWithoutInteractionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateOrConnectWithoutInteractionsInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutInteractionsInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutInteractionsInputObjectSchema),
		]),
	})
	.strict();

export const UserCreateOrConnectWithoutInteractionsInputObjectSchema = Schema;
