import { z } from 'zod';
import { EntryUpdateWithoutEntryMediaInputObjectSchema } from './EntryUpdateWithoutEntryMediaInput.schema';
import { EntryUncheckedUpdateWithoutEntryMediaInputObjectSchema } from './EntryUncheckedUpdateWithoutEntryMediaInput.schema';
import { EntryCreateWithoutEntryMediaInputObjectSchema } from './EntryCreateWithoutEntryMediaInput.schema';
import { EntryUncheckedCreateWithoutEntryMediaInputObjectSchema } from './EntryUncheckedCreateWithoutEntryMediaInput.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpsertWithoutEntryMediaInput> = z
	.object({
		update: z.union([
			z.lazy(() => EntryUpdateWithoutEntryMediaInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutEntryMediaInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => EntryCreateWithoutEntryMediaInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutEntryMediaInputObjectSchema),
		]),
		where: z.lazy(() => EntryWhereInputObjectSchema).optional(),
	})
	.strict();

export const EntryUpsertWithoutEntryMediaInputObjectSchema = Schema;
