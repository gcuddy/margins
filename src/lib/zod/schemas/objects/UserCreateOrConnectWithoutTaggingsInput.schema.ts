import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutTaggingsInputObjectSchema } from './UserCreateWithoutTaggingsInput.schema';
import { UserUncheckedCreateWithoutTaggingsInputObjectSchema } from './UserUncheckedCreateWithoutTaggingsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateOrConnectWithoutTaggingsInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutTaggingsInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutTaggingsInputObjectSchema),
		]),
	})
	.strict();

export const UserCreateOrConnectWithoutTaggingsInputObjectSchema = Schema;
