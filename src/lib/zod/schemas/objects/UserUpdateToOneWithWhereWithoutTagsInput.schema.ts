import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutTagsInputObjectSchema } from './UserUpdateWithoutTagsInput.schema';
import { UserUncheckedUpdateWithoutTagsInputObjectSchema } from './UserUncheckedUpdateWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTagsInput> = z
	.object({
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutTagsInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutTagsInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateToOneWithWhereWithoutTagsInputObjectSchema = Schema;
