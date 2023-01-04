import { z } from 'zod';
import { UserScalarWhereInputObjectSchema } from './UserScalarWhereInput.schema';
import { UserUpdateManyMutationInputObjectSchema } from './UserUpdateManyMutationInput.schema';
import { UserUncheckedUpdateManyWithoutFollowingInputObjectSchema } from './UserUncheckedUpdateManyWithoutFollowingInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutFollowedByInput> = z
	.object({
		where: z.lazy(() => UserScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => UserUpdateManyMutationInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateManyWithoutFollowingInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateManyWithWhereWithoutFollowedByInputObjectSchema = Schema;
