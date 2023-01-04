import { z } from 'zod';
import { UserCreateWithoutTagsInputObjectSchema } from './UserCreateWithoutTagsInput.schema';
import { UserUncheckedCreateWithoutTagsInputObjectSchema } from './UserUncheckedCreateWithoutTagsInput.schema';
import { UserCreateOrConnectWithoutTagsInputObjectSchema } from './UserCreateOrConnectWithoutTagsInput.schema';
import { UserUpsertWithoutTagsInputObjectSchema } from './UserUpsertWithoutTagsInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutTagsInputObjectSchema } from './UserUpdateToOneWithWhereWithoutTagsInput.schema';
import { UserUpdateWithoutTagsInputObjectSchema } from './UserUpdateWithoutTagsInput.schema';
import { UserUncheckedUpdateWithoutTagsInputObjectSchema } from './UserUncheckedUpdateWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutTagsNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutTagsInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutTagsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTagsInputObjectSchema).optional(),
		upsert: z.lazy(() => UserUpsertWithoutTagsInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutTagsInputObjectSchema),
				z.lazy(() => UserUpdateWithoutTagsInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutTagsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUpdateOneRequiredWithoutTagsNestedInputObjectSchema = Schema;
