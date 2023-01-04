import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutBookmarksInputObjectSchema } from './UserCreateWithoutBookmarksInput.schema';
import { UserUncheckedCreateWithoutBookmarksInputObjectSchema } from './UserUncheckedCreateWithoutBookmarksInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateOrConnectWithoutBookmarksInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutBookmarksInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutBookmarksInputObjectSchema),
		]),
	})
	.strict();

export const UserCreateOrConnectWithoutBookmarksInputObjectSchema = Schema;
