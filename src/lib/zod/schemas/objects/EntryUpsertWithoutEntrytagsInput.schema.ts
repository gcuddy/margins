import { z } from 'zod';
import { EntryUpdateWithoutEntrytagsInputObjectSchema } from './EntryUpdateWithoutEntrytagsInput.schema';
import { EntryUncheckedUpdateWithoutEntrytagsInputObjectSchema } from './EntryUncheckedUpdateWithoutEntrytagsInput.schema';
import { EntryCreateWithoutEntrytagsInputObjectSchema } from './EntryCreateWithoutEntrytagsInput.schema';
import { EntryUncheckedCreateWithoutEntrytagsInputObjectSchema } from './EntryUncheckedCreateWithoutEntrytagsInput.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpsertWithoutEntrytagsInput> = z
	.object({
		update: z.union([
			z.lazy(() => EntryUpdateWithoutEntrytagsInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutEntrytagsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => EntryCreateWithoutEntrytagsInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutEntrytagsInputObjectSchema),
		]),
		where: z.lazy(() => EntryWhereInputObjectSchema).optional(),
	})
	.strict();

export const EntryUpsertWithoutEntrytagsInputObjectSchema = Schema;
