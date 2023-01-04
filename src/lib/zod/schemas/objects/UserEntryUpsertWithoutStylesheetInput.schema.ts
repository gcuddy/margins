import { z } from 'zod';
import { UserEntryUpdateWithoutStylesheetInputObjectSchema } from './UserEntryUpdateWithoutStylesheetInput.schema';
import { UserEntryUncheckedUpdateWithoutStylesheetInputObjectSchema } from './UserEntryUncheckedUpdateWithoutStylesheetInput.schema';
import { UserEntryCreateWithoutStylesheetInputObjectSchema } from './UserEntryCreateWithoutStylesheetInput.schema';
import { UserEntryUncheckedCreateWithoutStylesheetInputObjectSchema } from './UserEntryUncheckedCreateWithoutStylesheetInput.schema';
import { UserEntryWhereInputObjectSchema } from './UserEntryWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryUpsertWithoutStylesheetInput> = z
	.object({
		update: z.union([
			z.lazy(() => UserEntryUpdateWithoutStylesheetInputObjectSchema),
			z.lazy(() => UserEntryUncheckedUpdateWithoutStylesheetInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => UserEntryCreateWithoutStylesheetInputObjectSchema),
			z.lazy(() => UserEntryUncheckedCreateWithoutStylesheetInputObjectSchema),
		]),
		where: z.lazy(() => UserEntryWhereInputObjectSchema).optional(),
	})
	.strict();

export const UserEntryUpsertWithoutStylesheetInputObjectSchema = Schema;
