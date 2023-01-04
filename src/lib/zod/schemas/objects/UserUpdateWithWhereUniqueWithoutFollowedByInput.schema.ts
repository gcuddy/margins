import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateWithoutFollowedByInputObjectSchema } from './UserUpdateWithoutFollowedByInput.schema';
import { UserUncheckedUpdateWithoutFollowedByInputObjectSchema } from './UserUncheckedUpdateWithoutFollowedByInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutFollowedByInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => UserUpdateWithoutFollowedByInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutFollowedByInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateWithWhereUniqueWithoutFollowedByInputObjectSchema = Schema;
