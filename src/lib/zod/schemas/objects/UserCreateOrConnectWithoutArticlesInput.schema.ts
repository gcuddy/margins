import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutArticlesInputObjectSchema } from './UserCreateWithoutArticlesInput.schema';
import { UserUncheckedCreateWithoutArticlesInputObjectSchema } from './UserUncheckedCreateWithoutArticlesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateOrConnectWithoutArticlesInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutArticlesInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutArticlesInputObjectSchema),
		]),
	})
	.strict();

export const UserCreateOrConnectWithoutArticlesInputObjectSchema = Schema;
