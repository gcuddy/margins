import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutAnnotationsInputObjectSchema } from './UserCreateWithoutAnnotationsInput.schema';
import { UserUncheckedCreateWithoutAnnotationsInputObjectSchema } from './UserUncheckedCreateWithoutAnnotationsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateOrConnectWithoutAnnotationsInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutAnnotationsInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutAnnotationsInputObjectSchema),
		]),
	})
	.strict();

export const UserCreateOrConnectWithoutAnnotationsInputObjectSchema = Schema;
