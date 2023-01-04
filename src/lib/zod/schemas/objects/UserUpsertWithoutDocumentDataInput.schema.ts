import { z } from 'zod';
import { UserUpdateWithoutDocumentDataInputObjectSchema } from './UserUpdateWithoutDocumentDataInput.schema';
import { UserUncheckedUpdateWithoutDocumentDataInputObjectSchema } from './UserUncheckedUpdateWithoutDocumentDataInput.schema';
import { UserCreateWithoutDocumentDataInputObjectSchema } from './UserCreateWithoutDocumentDataInput.schema';
import { UserUncheckedCreateWithoutDocumentDataInputObjectSchema } from './UserUncheckedCreateWithoutDocumentDataInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpsertWithoutDocumentDataInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserUpdateWithoutDocumentDataInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutDocumentDataInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutDocumentDataInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutDocumentDataInputObjectSchema),
		]),
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserUpsertWithoutDocumentDataInputObjectSchema = Schema;
