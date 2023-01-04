import { z } from 'zod';
import { UserUpdateWithoutTaggingsInputObjectSchema } from './UserUpdateWithoutTaggingsInput.schema';
import { UserUncheckedUpdateWithoutTaggingsInputObjectSchema } from './UserUncheckedUpdateWithoutTaggingsInput.schema';
import { UserCreateWithoutTaggingsInputObjectSchema } from './UserCreateWithoutTaggingsInput.schema';
import { UserUncheckedCreateWithoutTaggingsInputObjectSchema } from './UserUncheckedCreateWithoutTaggingsInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithoutTaggingsInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserUpdateWithoutTaggingsInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutTaggingsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutTaggingsInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutTaggingsInputObjectSchema),
		]),
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserUpsertWithoutTaggingsInputObjectSchema = Schema;
