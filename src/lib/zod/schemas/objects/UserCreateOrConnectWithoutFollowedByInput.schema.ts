import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutFollowedByInputObjectSchema } from './UserCreateWithoutFollowedByInput.schema';
import { UserUncheckedCreateWithoutFollowedByInputObjectSchema } from './UserUncheckedCreateWithoutFollowedByInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateOrConnectWithoutFollowedByInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutFollowedByInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutFollowedByInputObjectSchema),
		]),
	})
	.strict();

export const UserCreateOrConnectWithoutFollowedByInputObjectSchema = Schema;
