import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutAnnotationsInputObjectSchema } from './UserUpdateWithoutAnnotationsInput.schema';
import { UserUncheckedUpdateWithoutAnnotationsInputObjectSchema } from './UserUncheckedUpdateWithoutAnnotationsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAnnotationsInput> = z
	.object({
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutAnnotationsInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutAnnotationsInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateToOneWithWhereWithoutAnnotationsInputObjectSchema = Schema;
