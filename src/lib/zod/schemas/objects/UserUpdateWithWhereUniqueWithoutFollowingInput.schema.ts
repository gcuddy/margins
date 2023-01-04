import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateWithoutFollowingInputObjectSchema } from './UserUpdateWithoutFollowingInput.schema';
import { UserUncheckedUpdateWithoutFollowingInputObjectSchema } from './UserUncheckedUpdateWithoutFollowingInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutFollowingInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => UserUpdateWithoutFollowingInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutFollowingInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateWithWhereUniqueWithoutFollowingInputObjectSchema = Schema;
