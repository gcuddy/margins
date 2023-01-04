import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutTagsInputObjectSchema } from './UserCreateWithoutTagsInput.schema';
import { UserUncheckedCreateWithoutTagsInputObjectSchema } from './UserUncheckedCreateWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateOrConnectWithoutTagsInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutTagsInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutTagsInputObjectSchema),
		]),
	})
	.strict();

export const UserCreateOrConnectWithoutTagsInputObjectSchema = Schema;
