import { z } from 'zod';
import { UserCreateWithoutAnnotationsInputObjectSchema } from './UserCreateWithoutAnnotationsInput.schema';
import { UserUncheckedCreateWithoutAnnotationsInputObjectSchema } from './UserUncheckedCreateWithoutAnnotationsInput.schema';
import { UserCreateOrConnectWithoutAnnotationsInputObjectSchema } from './UserCreateOrConnectWithoutAnnotationsInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateNestedOneWithoutAnnotationsInput> = z
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
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserCreateNestedOneWithoutAnnotationsInputObjectSchema = Schema;
