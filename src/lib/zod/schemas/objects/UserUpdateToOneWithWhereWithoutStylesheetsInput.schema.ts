import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutStylesheetsInputObjectSchema } from './UserUpdateWithoutStylesheetsInput.schema';
import { UserUncheckedUpdateWithoutStylesheetsInputObjectSchema } from './UserUncheckedUpdateWithoutStylesheetsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutStylesheetsInput> = z
	.object({
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutStylesheetsInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutStylesheetsInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateToOneWithWhereWithoutStylesheetsInputObjectSchema = Schema;
