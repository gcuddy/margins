import { z } from 'zod';
import { EntryUpdateWithoutBookmarksInputObjectSchema } from './EntryUpdateWithoutBookmarksInput.schema';
import { EntryUncheckedUpdateWithoutBookmarksInputObjectSchema } from './EntryUncheckedUpdateWithoutBookmarksInput.schema';
import { EntryCreateWithoutBookmarksInputObjectSchema } from './EntryCreateWithoutBookmarksInput.schema';
import { EntryUncheckedCreateWithoutBookmarksInputObjectSchema } from './EntryUncheckedCreateWithoutBookmarksInput.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpsertWithoutBookmarksInput> = z
	.object({
		update: z.union([
			z.lazy(() => EntryUpdateWithoutBookmarksInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutBookmarksInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => EntryCreateWithoutBookmarksInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutBookmarksInputObjectSchema),
		]),
		where: z.lazy(() => EntryWhereInputObjectSchema).optional(),
	})
	.strict();

export const EntryUpsertWithoutBookmarksInputObjectSchema = Schema;
