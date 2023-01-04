import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutStylesheetsInputObjectSchema } from './UserCreateWithoutStylesheetsInput.schema';
import { UserUncheckedCreateWithoutStylesheetsInputObjectSchema } from './UserUncheckedCreateWithoutStylesheetsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateOrConnectWithoutStylesheetsInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutStylesheetsInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutStylesheetsInputObjectSchema),
		]),
	})
	.strict();

export const UserCreateOrConnectWithoutStylesheetsInputObjectSchema = Schema;
