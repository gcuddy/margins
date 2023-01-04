import { z } from 'zod';
import { UserEntryWhereInputObjectSchema } from './UserEntryWhereInput.schema';
import { UserEntryUpdateWithoutStylesheetInputObjectSchema } from './UserEntryUpdateWithoutStylesheetInput.schema';
import { UserEntryUncheckedUpdateWithoutStylesheetInputObjectSchema } from './UserEntryUncheckedUpdateWithoutStylesheetInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryUpdateToOneWithWhereWithoutStylesheetInput> = z
	.object({
		where: z.lazy(() => UserEntryWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => UserEntryUpdateWithoutStylesheetInputObjectSchema),
			z.lazy(() => UserEntryUncheckedUpdateWithoutStylesheetInputObjectSchema),
		]),
	})
	.strict();

export const UserEntryUpdateToOneWithWhereWithoutStylesheetInputObjectSchema = Schema;
