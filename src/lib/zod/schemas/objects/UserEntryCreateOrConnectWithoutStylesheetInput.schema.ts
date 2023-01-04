import { z } from 'zod';
import { UserEntryWhereUniqueInputObjectSchema } from './UserEntryWhereUniqueInput.schema';
import { UserEntryCreateWithoutStylesheetInputObjectSchema } from './UserEntryCreateWithoutStylesheetInput.schema';
import { UserEntryUncheckedCreateWithoutStylesheetInputObjectSchema } from './UserEntryUncheckedCreateWithoutStylesheetInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryCreateOrConnectWithoutStylesheetInput> = z
	.object({
		where: z.lazy(() => UserEntryWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => UserEntryCreateWithoutStylesheetInputObjectSchema),
			z.lazy(() => UserEntryUncheckedCreateWithoutStylesheetInputObjectSchema),
		]),
	})
	.strict();

export const UserEntryCreateOrConnectWithoutStylesheetInputObjectSchema = Schema;
