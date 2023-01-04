import { z } from 'zod';
import { UserCreateWithoutBookmarksInputObjectSchema } from './UserCreateWithoutBookmarksInput.schema';
import { UserUncheckedCreateWithoutBookmarksInputObjectSchema } from './UserUncheckedCreateWithoutBookmarksInput.schema';
import { UserCreateOrConnectWithoutBookmarksInputObjectSchema } from './UserCreateOrConnectWithoutBookmarksInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateNestedOneWithoutBookmarksInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutBookmarksInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutBookmarksInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutBookmarksInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserCreateNestedOneWithoutBookmarksInputObjectSchema = Schema;
