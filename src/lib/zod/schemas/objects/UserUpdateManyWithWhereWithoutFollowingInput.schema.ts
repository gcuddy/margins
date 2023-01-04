import { z } from 'zod';
import { UserScalarWhereInputObjectSchema } from './UserScalarWhereInput.schema';
import { UserUpdateManyMutationInputObjectSchema } from './UserUpdateManyMutationInput.schema';
import { UserUncheckedUpdateManyWithoutFollowedByInputObjectSchema } from './UserUncheckedUpdateManyWithoutFollowedByInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutFollowingInput> = z
	.object({
		where: z.lazy(() => UserScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => UserUpdateManyMutationInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateManyWithoutFollowedByInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateManyWithWhereWithoutFollowingInputObjectSchema = Schema;
