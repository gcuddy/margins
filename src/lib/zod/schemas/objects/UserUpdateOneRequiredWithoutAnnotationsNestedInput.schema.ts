import { z } from 'zod';
import { UserCreateWithoutAnnotationsInputObjectSchema } from './UserCreateWithoutAnnotationsInput.schema';
import { UserUncheckedCreateWithoutAnnotationsInputObjectSchema } from './UserUncheckedCreateWithoutAnnotationsInput.schema';
import { UserCreateOrConnectWithoutAnnotationsInputObjectSchema } from './UserCreateOrConnectWithoutAnnotationsInput.schema';
import { UserUpsertWithoutAnnotationsInputObjectSchema } from './UserUpsertWithoutAnnotationsInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutAnnotationsInputObjectSchema } from './UserUpdateToOneWithWhereWithoutAnnotationsInput.schema';
import { UserUpdateWithoutAnnotationsInputObjectSchema } from './UserUpdateWithoutAnnotationsInput.schema';
import { UserUncheckedUpdateWithoutAnnotationsInputObjectSchema } from './UserUncheckedUpdateWithoutAnnotationsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAnnotationsNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutAnnotationsInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutAnnotationsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => UserCreateOrConnectWithoutAnnotationsInputObjectSchema)
			.optional(),
		upsert: z.lazy(() => UserUpsertWithoutAnnotationsInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutAnnotationsInputObjectSchema),
				z.lazy(() => UserUpdateWithoutAnnotationsInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutAnnotationsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUpdateOneRequiredWithoutAnnotationsNestedInputObjectSchema = Schema;
