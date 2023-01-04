import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutTaggingsInputObjectSchema } from './UserUpdateWithoutTaggingsInput.schema';
import { UserUncheckedUpdateWithoutTaggingsInputObjectSchema } from './UserUncheckedUpdateWithoutTaggingsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTaggingsInput> = z
	.object({
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutTaggingsInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutTaggingsInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateToOneWithWhereWithoutTaggingsInputObjectSchema = Schema;
