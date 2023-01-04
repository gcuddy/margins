import { z } from 'zod';
import { UserCreateWithoutTagsInputObjectSchema } from './UserCreateWithoutTagsInput.schema';
import { UserUncheckedCreateWithoutTagsInputObjectSchema } from './UserUncheckedCreateWithoutTagsInput.schema';
import { UserCreateOrConnectWithoutTagsInputObjectSchema } from './UserCreateOrConnectWithoutTagsInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateNestedOneWithoutTagsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutTagsInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutTagsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTagsInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserCreateNestedOneWithoutTagsInputObjectSchema = Schema;
