import { z } from 'zod';
import { UserEntryCreateWithoutStylesheetInputObjectSchema } from './UserEntryCreateWithoutStylesheetInput.schema';
import { UserEntryUncheckedCreateWithoutStylesheetInputObjectSchema } from './UserEntryUncheckedCreateWithoutStylesheetInput.schema';
import { UserEntryCreateOrConnectWithoutStylesheetInputObjectSchema } from './UserEntryCreateOrConnectWithoutStylesheetInput.schema';
import { UserEntryWhereUniqueInputObjectSchema } from './UserEntryWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryCreateNestedOneWithoutStylesheetInput> = z
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
		connect: z.lazy(() => UserEntryWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const UserEntryCreateNestedOneWithoutStylesheetInputObjectSchema = Schema;
