import { z } from 'zod';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutDocumentDataInputObjectSchema } from './UserUpdateWithoutDocumentDataInput.schema';
import { UserUncheckedUpdateWithoutDocumentDataInputObjectSchema } from './UserUncheckedUpdateWithoutDocumentDataInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutDocumentDataInput> = z
	.object({
		where: z.lazy(() => UserWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutDocumentDataInputObjectSchema),
			z.lazy(() => UserUncheckedUpdateWithoutDocumentDataInputObjectSchema),
		]),
	})
	.strict();

export const UserUpdateToOneWithWhereWithoutDocumentDataInputObjectSchema = Schema;
