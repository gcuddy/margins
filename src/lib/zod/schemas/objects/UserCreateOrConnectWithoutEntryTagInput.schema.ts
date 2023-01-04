import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutEntryTagInputObjectSchema } from './UserCreateWithoutEntryTagInput.schema';
import { UserUncheckedCreateWithoutEntryTagInputObjectSchema } from './UserUncheckedCreateWithoutEntryTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateOrConnectWithoutEntryTagInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutEntryTagInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutEntryTagInputObjectSchema),
		]),
	})
	.strict();

export const UserCreateOrConnectWithoutEntryTagInputObjectSchema = Schema;
