import { z } from 'zod';
import { UserCreateWithoutEntryTagInputObjectSchema } from './UserCreateWithoutEntryTagInput.schema';
import { UserUncheckedCreateWithoutEntryTagInputObjectSchema } from './UserUncheckedCreateWithoutEntryTagInput.schema';
import { UserCreateOrConnectWithoutEntryTagInputObjectSchema } from './UserCreateOrConnectWithoutEntryTagInput.schema';
import { UserUpsertWithoutEntryTagInputObjectSchema } from './UserUpsertWithoutEntryTagInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutEntryTagInputObjectSchema } from './UserUpdateToOneWithWhereWithoutEntryTagInput.schema';
import { UserUpdateWithoutEntryTagInputObjectSchema } from './UserUpdateWithoutEntryTagInput.schema';
import { UserUncheckedUpdateWithoutEntryTagInputObjectSchema } from './UserUncheckedUpdateWithoutEntryTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutEntryTagNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutEntryTagInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutEntryTagInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutEntryTagInputObjectSchema).optional(),
		upsert: z.lazy(() => UserUpsertWithoutEntryTagInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutEntryTagInputObjectSchema),
				z.lazy(() => UserUpdateWithoutEntryTagInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutEntryTagInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUpdateOneRequiredWithoutEntryTagNestedInputObjectSchema = Schema;
