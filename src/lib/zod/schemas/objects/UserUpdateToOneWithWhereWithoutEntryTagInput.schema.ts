import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutEntryTagInputObjectSchema } from './UserUpdateWithoutEntryTagInput.schema';
import { UserUncheckedUpdateWithoutEntryTagInputObjectSchema } from './UserUncheckedUpdateWithoutEntryTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutEntryTagInput> = z
	.object({
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutEntryTagInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutEntryTagInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateToOneWithWhereWithoutEntryTagInputObjectSchema = Schema;
