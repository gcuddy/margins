import { z } from 'zod';
import { EntryDataWhereUniqueInputObjectSchema } from './EntryDataWhereUniqueInput.schema';
import { EntryDataUpdateWithoutEntryInputObjectSchema } from './EntryDataUpdateWithoutEntryInput.schema';
import { EntryDataUncheckedUpdateWithoutEntryInputObjectSchema } from './EntryDataUncheckedUpdateWithoutEntryInput.schema';
import { EntryDataCreateWithoutEntryInputObjectSchema } from './EntryDataCreateWithoutEntryInput.schema';
import { EntryDataUncheckedCreateWithoutEntryInputObjectSchema } from './EntryDataUncheckedCreateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataUpsertWithWhereUniqueWithoutEntryInput> = z
	.object({
		where: z.lazy(() => EntryDataWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => EntryDataUpdateWithoutEntryInputObjectSchema),
			z.lazy(() => EntryDataUncheckedUpdateWithoutEntryInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => EntryDataCreateWithoutEntryInputObjectSchema),
			z.lazy(() => EntryDataUncheckedCreateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const EntryDataUpsertWithWhereUniqueWithoutEntryInputObjectSchema = Schema;
