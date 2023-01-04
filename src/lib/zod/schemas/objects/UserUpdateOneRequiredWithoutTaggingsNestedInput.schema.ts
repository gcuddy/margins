import { z } from 'zod';
import { UserCreateWithoutTaggingsInputObjectSchema } from './UserCreateWithoutTaggingsInput.schema';
import { UserUncheckedCreateWithoutTaggingsInputObjectSchema } from './UserUncheckedCreateWithoutTaggingsInput.schema';
import { UserCreateOrConnectWithoutTaggingsInputObjectSchema } from './UserCreateOrConnectWithoutTaggingsInput.schema';
import { UserUpsertWithoutTaggingsInputObjectSchema } from './UserUpsertWithoutTaggingsInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutTaggingsInputObjectSchema } from './UserUpdateToOneWithWhereWithoutTaggingsInput.schema';
import { UserUpdateWithoutTaggingsInputObjectSchema } from './UserUpdateWithoutTaggingsInput.schema';
import { UserUncheckedUpdateWithoutTaggingsInputObjectSchema } from './UserUncheckedUpdateWithoutTaggingsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutTaggingsNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutTaggingsInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutTaggingsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTaggingsInputObjectSchema).optional(),
		upsert: z.lazy(() => UserUpsertWithoutTaggingsInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutTaggingsInputObjectSchema),
				z.lazy(() => UserUpdateWithoutTaggingsInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutTaggingsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUpdateOneRequiredWithoutTaggingsNestedInputObjectSchema = Schema;
