import { z } from 'zod';
import { UserCreateWithoutStylesheetsInputObjectSchema } from './UserCreateWithoutStylesheetsInput.schema';
import { UserUncheckedCreateWithoutStylesheetsInputObjectSchema } from './UserUncheckedCreateWithoutStylesheetsInput.schema';
import { UserCreateOrConnectWithoutStylesheetsInputObjectSchema } from './UserCreateOrConnectWithoutStylesheetsInput.schema';
import { UserUpsertWithoutStylesheetsInputObjectSchema } from './UserUpsertWithoutStylesheetsInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutStylesheetsInputObjectSchema } from './UserUpdateToOneWithWhereWithoutStylesheetsInput.schema';
import { UserUpdateWithoutStylesheetsInputObjectSchema } from './UserUpdateWithoutStylesheetsInput.schema';
import { UserUncheckedUpdateWithoutStylesheetsInputObjectSchema } from './UserUncheckedUpdateWithoutStylesheetsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutStylesheetsNestedInput> = z
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
		upsert: z.lazy(() => UserUpsertWithoutStylesheetsInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutStylesheetsInputObjectSchema),
				z.lazy(() => UserUpdateWithoutStylesheetsInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutStylesheetsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUpdateOneRequiredWithoutStylesheetsNestedInputObjectSchema = Schema;
