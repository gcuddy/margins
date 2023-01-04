import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateWithoutFollowedByInputObjectSchema } from './UserUpdateWithoutFollowedByInput.schema';
import { UserUncheckedUpdateWithoutFollowedByInputObjectSchema } from './UserUncheckedUpdateWithoutFollowedByInput.schema';
import { UserCreateWithoutFollowedByInputObjectSchema } from './UserCreateWithoutFollowedByInput.schema';
import { UserUncheckedCreateWithoutFollowedByInputObjectSchema } from './UserUncheckedCreateWithoutFollowedByInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutFollowedByInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => UserUpdateWithoutFollowedByInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutFollowedByInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutFollowedByInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutFollowedByInputObjectSchema),
		]),
	})
	.strict();

export const UserUpsertWithWhereUniqueWithoutFollowedByInputObjectSchema = Schema;
