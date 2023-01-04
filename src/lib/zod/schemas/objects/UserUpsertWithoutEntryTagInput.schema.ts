import { z } from 'zod';
import { UserUpdateWithoutEntryTagInputObjectSchema } from './UserUpdateWithoutEntryTagInput.schema';
import { UserUncheckedUpdateWithoutEntryTagInputObjectSchema } from './UserUncheckedUpdateWithoutEntryTagInput.schema';
import { UserCreateWithoutEntryTagInputObjectSchema } from './UserCreateWithoutEntryTagInput.schema';
import { UserUncheckedCreateWithoutEntryTagInputObjectSchema } from './UserUncheckedCreateWithoutEntryTagInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithoutEntryTagInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserUpdateWithoutEntryTagInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutEntryTagInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutEntryTagInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutEntryTagInputObjectSchema),
		]),
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserUpsertWithoutEntryTagInputObjectSchema = Schema;
