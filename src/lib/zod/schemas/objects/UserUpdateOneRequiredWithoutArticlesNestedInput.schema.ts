import { z } from 'zod';
import { UserCreateWithoutArticlesInputObjectSchema } from './UserCreateWithoutArticlesInput.schema';
import { UserUncheckedCreateWithoutArticlesInputObjectSchema } from './UserUncheckedCreateWithoutArticlesInput.schema';
import { UserCreateOrConnectWithoutArticlesInputObjectSchema } from './UserCreateOrConnectWithoutArticlesInput.schema';
import { UserUpsertWithoutArticlesInputObjectSchema } from './UserUpsertWithoutArticlesInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutArticlesInputObjectSchema } from './UserUpdateToOneWithWhereWithoutArticlesInput.schema';
import { UserUpdateWithoutArticlesInputObjectSchema } from './UserUpdateWithoutArticlesInput.schema';
import { UserUncheckedUpdateWithoutArticlesInputObjectSchema } from './UserUncheckedUpdateWithoutArticlesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutArticlesNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutArticlesInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutArticlesInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutArticlesInputObjectSchema).optional(),
		upsert: z.lazy(() => UserUpsertWithoutArticlesInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutArticlesInputObjectSchema),
				z.lazy(() => UserUpdateWithoutArticlesInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutArticlesInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUpdateOneRequiredWithoutArticlesNestedInputObjectSchema = Schema;
