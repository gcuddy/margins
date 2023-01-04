import { z } from 'zod';
import { UserCreateWithoutStylesheetsInputObjectSchema } from './UserCreateWithoutStylesheetsInput.schema';
import { UserUncheckedCreateWithoutStylesheetsInputObjectSchema } from './UserUncheckedCreateWithoutStylesheetsInput.schema';
import { UserCreateOrConnectWithoutStylesheetsInputObjectSchema } from './UserCreateOrConnectWithoutStylesheetsInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateNestedOneWithoutStylesheetsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutStylesheetsInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutStylesheetsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => UserCreateOrConnectWithoutStylesheetsInputObjectSchema)
			.optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserCreateNestedOneWithoutStylesheetsInputObjectSchema = Schema;
