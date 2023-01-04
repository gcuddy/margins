import { z } from 'zod';
import { UserCreateWithoutEntryTagInputObjectSchema } from './UserCreateWithoutEntryTagInput.schema';
import { UserUncheckedCreateWithoutEntryTagInputObjectSchema } from './UserUncheckedCreateWithoutEntryTagInput.schema';
import { UserCreateOrConnectWithoutEntryTagInputObjectSchema } from './UserCreateOrConnectWithoutEntryTagInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateNestedOneWithoutEntryTagInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutEntryTagInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutEntryTagInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutEntryTagInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserCreateNestedOneWithoutEntryTagInputObjectSchema = Schema;
