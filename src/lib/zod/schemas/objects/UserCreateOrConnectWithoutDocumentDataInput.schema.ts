import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutDocumentDataInputObjectSchema } from './UserCreateWithoutDocumentDataInput.schema';
import { UserUncheckedCreateWithoutDocumentDataInputObjectSchema } from './UserUncheckedCreateWithoutDocumentDataInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateOrConnectWithoutDocumentDataInput> = z
	.object({
		where: z.lazy(() => UserWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutDocumentDataInputObjectSchema),
			z.lazy(() => UserUncheckedCreateWithoutDocumentDataInputObjectSchema),
		]),
	})
	.strict();

export const UserCreateOrConnectWithoutDocumentDataInputObjectSchema = Schema;
