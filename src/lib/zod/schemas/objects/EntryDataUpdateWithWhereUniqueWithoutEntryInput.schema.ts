import { z } from 'zod';
import { EntryDataWhereUniqueInputObjectSchema } from './EntryDataWhereUniqueInput.schema';
import { EntryDataUpdateWithoutEntryInputObjectSchema } from './EntryDataUpdateWithoutEntryInput.schema';
import { EntryDataUncheckedUpdateWithoutEntryInputObjectSchema } from './EntryDataUncheckedUpdateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataUpdateWithWhereUniqueWithoutEntryInput> = z
	.object({
		where: z.lazy(() => EntryDataWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => EntryDataUpdateWithoutEntryInputObjectSchema),
			z.lazy(() => EntryDataUncheckedUpdateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const EntryDataUpdateWithWhereUniqueWithoutEntryInputObjectSchema = Schema;
