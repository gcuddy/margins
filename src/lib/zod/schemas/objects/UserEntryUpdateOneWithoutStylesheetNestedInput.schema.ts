import { z } from 'zod';
import { UserEntryCreateWithoutStylesheetInputObjectSchema } from './UserEntryCreateWithoutStylesheetInput.schema';
import { UserEntryUncheckedCreateWithoutStylesheetInputObjectSchema } from './UserEntryUncheckedCreateWithoutStylesheetInput.schema';
import { UserEntryCreateOrConnectWithoutStylesheetInputObjectSchema } from './UserEntryCreateOrConnectWithoutStylesheetInput.schema';
import { UserEntryUpsertWithoutStylesheetInputObjectSchema } from './UserEntryUpsertWithoutStylesheetInput.schema';
import { UserEntryWhereInputObjectSchema } from './UserEntryWhereInput.schema';
import { UserEntryWhereUniqueInputObjectSchema } from './UserEntryWhereUniqueInput.schema';
import { UserEntryUpdateToOneWithWhereWithoutStylesheetInputObjectSchema } from './UserEntryUpdateToOneWithWhereWithoutStylesheetInput.schema';
import { UserEntryUpdateWithoutStylesheetInputObjectSchema } from './UserEntryUpdateWithoutStylesheetInput.schema';
import { UserEntryUncheckedUpdateWithoutStylesheetInputObjectSchema } from './UserEntryUncheckedUpdateWithoutStylesheetInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryUpdateOneWithoutStylesheetNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => UserEntryCreateWithoutStylesheetInputObjectSchema),
				z.lazy(() => UserEntryUncheckedCreateWithoutStylesheetInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => UserEntryCreateOrConnectWithoutStylesheetInputObjectSchema)
			.optional(),
		upsert: z.lazy(() => UserEntryUpsertWithoutStylesheetInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => UserEntryWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => UserEntryWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => UserEntryWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserEntryUpdateToOneWithWhereWithoutStylesheetInputObjectSchema),
				z.lazy(() => UserEntryUpdateWithoutStylesheetInputObjectSchema),
				z.lazy(() => UserEntryUncheckedUpdateWithoutStylesheetInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const UserEntryUpdateOneWithoutStylesheetNestedInputObjectSchema = Schema;
