import { z } from 'zod';
import { UserCreateWithoutTaggingsInputObjectSchema } from './UserCreateWithoutTaggingsInput.schema';
import { UserUncheckedCreateWithoutTaggingsInputObjectSchema } from './UserUncheckedCreateWithoutTaggingsInput.schema';
import { UserCreateOrConnectWithoutTaggingsInputObjectSchema } from './UserCreateOrConnectWithoutTaggingsInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateNestedOneWithoutTaggingsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutTaggingsInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutTaggingsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTaggingsInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserCreateNestedOneWithoutTaggingsInputObjectSchema = Schema;
