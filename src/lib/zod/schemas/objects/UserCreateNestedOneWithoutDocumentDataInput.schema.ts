import { z } from 'zod';
import { UserCreateWithoutDocumentDataInputObjectSchema } from './UserCreateWithoutDocumentDataInput.schema';
import { UserUncheckedCreateWithoutDocumentDataInputObjectSchema } from './UserUncheckedCreateWithoutDocumentDataInput.schema';
import { UserCreateOrConnectWithoutDocumentDataInputObjectSchema } from './UserCreateOrConnectWithoutDocumentDataInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserCreateNestedOneWithoutDocumentDataInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutDocumentDataInputObjectSchema),
				z.lazy(() => UserUncheckedCreateWithoutDocumentDataInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => UserCreateOrConnectWithoutDocumentDataInputObjectSchema)
			.optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserCreateNestedOneWithoutDocumentDataInputObjectSchema = Schema;
