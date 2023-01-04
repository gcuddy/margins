import { z } from 'zod';
import { UserUpdateWithoutTagsInputObjectSchema } from './UserUpdateWithoutTagsInput.schema';
import { UserUncheckedUpdateWithoutTagsInputObjectSchema } from './UserUncheckedUpdateWithoutTagsInput.schema';
import { UserCreateWithoutTagsInputObjectSchema } from './UserCreateWithoutTagsInput.schema';
import { UserUncheckedCreateWithoutTagsInputObjectSchema } from './UserUncheckedCreateWithoutTagsInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithoutTagsInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserUpdateWithoutTagsInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutTagsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutTagsInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutTagsInputObjectSchema),
		]),
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserUpsertWithoutTagsInputObjectSchema = Schema;
