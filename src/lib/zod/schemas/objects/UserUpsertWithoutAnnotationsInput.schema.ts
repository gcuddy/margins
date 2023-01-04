import { z } from 'zod';
import { UserUpdateWithoutAnnotationsInputObjectSchema } from './UserUpdateWithoutAnnotationsInput.schema';
import { UserUncheckedUpdateWithoutAnnotationsInputObjectSchema } from './UserUncheckedUpdateWithoutAnnotationsInput.schema';
import { UserCreateWithoutAnnotationsInputObjectSchema } from './UserCreateWithoutAnnotationsInput.schema';
import { UserUncheckedCreateWithoutAnnotationsInputObjectSchema } from './UserUncheckedCreateWithoutAnnotationsInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithoutAnnotationsInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserUpdateWithoutAnnotationsInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutAnnotationsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutAnnotationsInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutAnnotationsInputObjectSchema),
		]),
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserUpsertWithoutAnnotationsInputObjectSchema = Schema;
