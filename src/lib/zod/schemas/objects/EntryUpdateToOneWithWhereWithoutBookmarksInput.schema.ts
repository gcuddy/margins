import { z } from 'zod';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';
import { EntryUpdateWithoutBookmarksInputObjectSchema } from './EntryUpdateWithoutBookmarksInput.schema';
import { EntryUncheckedUpdateWithoutBookmarksInputObjectSchema } from './EntryUncheckedUpdateWithoutBookmarksInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpdateToOneWithWhereWithoutBookmarksInput> = z
	.object({
		where: z.lazy(() => EntryWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => EntryUpdateWithoutBookmarksInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutBookmarksInputObjectSchema),
		]),
	})
	.strict();

export const EntryUpdateToOneWithWhereWithoutBookmarksInputObjectSchema = Schema;
