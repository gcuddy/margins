import { z } from 'zod';
import { UserUpdateWithoutStylesheetsInputObjectSchema } from './UserUpdateWithoutStylesheetsInput.schema';
import { UserUncheckedUpdateWithoutStylesheetsInputObjectSchema } from './UserUncheckedUpdateWithoutStylesheetsInput.schema';
import { UserCreateWithoutStylesheetsInputObjectSchema } from './UserCreateWithoutStylesheetsInput.schema';
import { UserUncheckedCreateWithoutStylesheetsInputObjectSchema } from './UserUncheckedCreateWithoutStylesheetsInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithoutStylesheetsInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserUpdateWithoutStylesheetsInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutStylesheetsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutStylesheetsInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutStylesheetsInputObjectSchema),
		]),
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserUpsertWithoutStylesheetsInputObjectSchema = Schema;
