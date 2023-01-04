import { z } from 'zod';
import { UserCreateWithoutDocumentDataInputObjectSchema } from './UserCreateWithoutDocumentDataInput.schema';
import { UserUncheckedCreateWithoutDocumentDataInputObjectSchema } from './UserUncheckedCreateWithoutDocumentDataInput.schema';
import { UserCreateOrConnectWithoutDocumentDataInputObjectSchema } from './UserCreateOrConnectWithoutDocumentDataInput.schema';
import { UserUpsertWithoutDocumentDataInputObjectSchema } from './UserUpsertWithoutDocumentDataInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutDocumentDataInputObjectSchema } from './UserUpdateToOneWithWhereWithoutDocumentDataInput.schema';
import { UserUpdateWithoutDocumentDataInputObjectSchema } from './UserUpdateWithoutDocumentDataInput.schema';
import { UserUncheckedUpdateWithoutDocumentDataInputObjectSchema } from './UserUncheckedUpdateWithoutDocumentDataInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutDocumentDataNestedInput> = z
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
		upsert: z.lazy(() => UserUpsertWithoutDocumentDataInputObjectSchema).optional(),
		connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutDocumentDataInputObjectSchema),
				z.lazy(() => UserUpdateWithoutDocumentDataInputObjectSchema),
				z.lazy(() => UserUncheckedUpdateWithoutDocumentDataInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserUpdateOneRequiredWithoutDocumentDataNestedInputObjectSchema = Schema;
