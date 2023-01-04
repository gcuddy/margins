import { z } from 'zod';
import { EntryMediaWhereUniqueInputObjectSchema } from './EntryMediaWhereUniqueInput.schema';
import { EntryMediaUpdateWithoutEntryInputObjectSchema } from './EntryMediaUpdateWithoutEntryInput.schema';
import { EntryMediaUncheckedUpdateWithoutEntryInputObjectSchema } from './EntryMediaUncheckedUpdateWithoutEntryInput.schema';
import { EntryMediaCreateWithoutEntryInputObjectSchema } from './EntryMediaCreateWithoutEntryInput.schema';
import { EntryMediaUncheckedCreateWithoutEntryInputObjectSchema } from './EntryMediaUncheckedCreateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaUpsertWithWhereUniqueWithoutEntryInput> = z
	.object({
		where: z.lazy(() => EntryMediaWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => EntryMediaUpdateWithoutEntryInputObjectSchema),
			z.lazy(() => EntryMediaUncheckedUpdateWithoutEntryInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => EntryMediaCreateWithoutEntryInputObjectSchema),
			z.lazy(() => EntryMediaUncheckedCreateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const EntryMediaUpsertWithWhereUniqueWithoutEntryInputObjectSchema = Schema;
