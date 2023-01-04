import { z } from 'zod';
import { EntryUpdateWithoutContextInputObjectSchema } from './EntryUpdateWithoutContextInput.schema';
import { EntryUncheckedUpdateWithoutContextInputObjectSchema } from './EntryUncheckedUpdateWithoutContextInput.schema';
import { EntryCreateWithoutContextInputObjectSchema } from './EntryCreateWithoutContextInput.schema';
import { EntryUncheckedCreateWithoutContextInputObjectSchema } from './EntryUncheckedCreateWithoutContextInput.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpsertWithoutContextInput> = z
	.object({
		update: z.union([
			z.lazy(() => EntryUpdateWithoutContextInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutContextInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => EntryCreateWithoutContextInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutContextInputObjectSchema),
		]),
		where: z.lazy(() => EntryWhereInputObjectSchema).optional(),
	})
	.strict();

export const EntryUpsertWithoutContextInputObjectSchema = Schema;
