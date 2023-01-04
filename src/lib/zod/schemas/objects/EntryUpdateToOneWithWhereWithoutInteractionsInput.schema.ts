import { z } from 'zod';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';
import { EntryUpdateWithoutInteractionsInputObjectSchema } from './EntryUpdateWithoutInteractionsInput.schema';
import { EntryUncheckedUpdateWithoutInteractionsInputObjectSchema } from './EntryUncheckedUpdateWithoutInteractionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpdateToOneWithWhereWithoutInteractionsInput> = z
	.object({
		where: z.lazy(() => EntryWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => EntryUpdateWithoutInteractionsInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutInteractionsInputObjectSchema),
		]),
	})
	.strict();

export const EntryUpdateToOneWithWhereWithoutInteractionsInputObjectSchema = Schema;
