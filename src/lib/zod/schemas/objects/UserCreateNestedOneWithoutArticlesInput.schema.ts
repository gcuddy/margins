import { z } from 'zod';
import { UserCreateWithoutArticlesInputObjectSchema } from './UserCreateWithoutArticlesInput.schema';
import { UserUncheckedCreateWithoutArticlesInputObjectSchema } from './UserUncheckedCreateWithoutArticlesInput.schema';
import { UserCreateOrConnectWithoutArticlesInputObjectSchema } from './UserCreateOrConnectWithoutArticlesInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateNestedOneWithoutArticlesInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutArticlesInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutArticlesInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutArticlesInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserCreateNestedOneWithoutArticlesInputObjectSchema = Schema;
