import { z } from 'zod';
import { UserUpdateWithoutCollectionsInputObjectSchema } from './UserUpdateWithoutCollectionsInput.schema';
import { UserUncheckedUpdateWithoutCollectionsInputObjectSchema } from './UserUncheckedUpdateWithoutCollectionsInput.schema';
import { UserCreateWithoutCollectionsInputObjectSchema } from './UserCreateWithoutCollectionsInput.schema';
import { UserUncheckedCreateWithoutCollectionsInputObjectSchema } from './UserUncheckedCreateWithoutCollectionsInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithoutCollectionsInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserUpdateWithoutCollectionsInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutCollectionsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutCollectionsInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutCollectionsInputObjectSchema),
		]),
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserUpsertWithoutCollectionsInputObjectSchema = Schema;
