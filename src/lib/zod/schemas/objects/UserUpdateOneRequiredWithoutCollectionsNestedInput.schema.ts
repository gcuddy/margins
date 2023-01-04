import { z } from 'zod';
import { UserCreateWithoutCollectionsInputObjectSchema } from './UserCreateWithoutCollectionsInput.schema';
import { UserUncheckedCreateWithoutCollectionsInputObjectSchema } from './UserUncheckedCreateWithoutCollectionsInput.schema';
import { UserCreateOrConnectWithoutCollectionsInputObjectSchema } from './UserCreateOrConnectWithoutCollectionsInput.schema';
import { UserUpsertWithoutCollectionsInputObjectSchema } from './UserUpsertWithoutCollectionsInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutCollectionsInputObjectSchema } from './UserUpdateToOneWithWhereWithoutCollectionsInput.schema';
import { UserUpdateWithoutCollectionsInputObjectSchema } from './UserUpdateWithoutCollectionsInput.schema';
import { UserUncheckedUpdateWithoutCollectionsInputObjectSchema } from './UserUncheckedUpdateWithoutCollectionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutCollectionsNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutCollectionsInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutCollectionsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => UserCreateOrConnectWithoutCollectionsInputObjectSchema)
			.optional(),
		upsert: z.lazy(() => UserUpsertWithoutCollectionsInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutCollectionsInputObjectSchema),
				z.lazy(() => UserUpdateWithoutCollectionsInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutCollectionsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUpdateOneRequiredWithoutCollectionsNestedInputObjectSchema = Schema;
