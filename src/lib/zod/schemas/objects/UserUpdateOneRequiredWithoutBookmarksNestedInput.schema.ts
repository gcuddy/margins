import { z } from 'zod';
import { UserCreateWithoutBookmarksInputObjectSchema } from './UserCreateWithoutBookmarksInput.schema';
import { UserUncheckedCreateWithoutBookmarksInputObjectSchema } from './UserUncheckedCreateWithoutBookmarksInput.schema';
import { UserCreateOrConnectWithoutBookmarksInputObjectSchema } from './UserCreateOrConnectWithoutBookmarksInput.schema';
import { UserUpsertWithoutBookmarksInputObjectSchema } from './UserUpsertWithoutBookmarksInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutBookmarksInputObjectSchema } from './UserUpdateToOneWithWhereWithoutBookmarksInput.schema';
import { UserUpdateWithoutBookmarksInputObjectSchema } from './UserUpdateWithoutBookmarksInput.schema';
import { UserUncheckedUpdateWithoutBookmarksInputObjectSchema } from './UserUncheckedUpdateWithoutBookmarksInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutBookmarksNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutBookmarksInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutBookmarksInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutBookmarksInputObjectSchema).optional(),
		upsert: z.lazy(() => UserUpsertWithoutBookmarksInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutBookmarksInputObjectSchema),
				z.lazy(() => UserUpdateWithoutBookmarksInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutBookmarksInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUpdateOneRequiredWithoutBookmarksNestedInputObjectSchema = Schema;
