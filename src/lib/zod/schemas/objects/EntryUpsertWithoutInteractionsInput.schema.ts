import { z } from 'zod';
import { EntryUpdateWithoutInteractionsInputObjectSchema } from './EntryUpdateWithoutInteractionsInput.schema';
import { EntryUncheckedUpdateWithoutInteractionsInputObjectSchema } from './EntryUncheckedUpdateWithoutInteractionsInput.schema';
import { EntryCreateWithoutInteractionsInputObjectSchema } from './EntryCreateWithoutInteractionsInput.schema';
import { EntryUncheckedCreateWithoutInteractionsInputObjectSchema } from './EntryUncheckedCreateWithoutInteractionsInput.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpsertWithoutInteractionsInput> = z
	.object({
		update: z.union([
			z.lazy(() => EntryUpdateWithoutInteractionsInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutInteractionsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => EntryCreateWithoutInteractionsInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutInteractionsInputObjectSchema),
		]),
		where: z.lazy(() => EntryWhereInputObjectSchema).optional(),
	})
	.strict();

export const EntryUpsertWithoutInteractionsInputObjectSchema = Schema;
