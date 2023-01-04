import { z } from 'zod';
import { EntryTagWhereUniqueInputObjectSchema } from './EntryTagWhereUniqueInput.schema';
import { EntryTagUpdateWithoutEntryInputObjectSchema } from './EntryTagUpdateWithoutEntryInput.schema';
import { EntryTagUncheckedUpdateWithoutEntryInputObjectSchema } from './EntryTagUncheckedUpdateWithoutEntryInput.schema';
import { EntryTagCreateWithoutEntryInputObjectSchema } from './EntryTagCreateWithoutEntryInput.schema';
import { EntryTagUncheckedCreateWithoutEntryInputObjectSchema } from './EntryTagUncheckedCreateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagUpsertWithWhereUniqueWithoutEntryInput> = z
	.object({
		where: z.lazy(() => EntryTagWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => EntryTagUpdateWithoutEntryInputObjectSchema),
			z.lazy(() => EntryTagUncheckedUpdateWithoutEntryInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => EntryTagCreateWithoutEntryInputObjectSchema),
			z.lazy(() => EntryTagUncheckedCreateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const EntryTagUpsertWithWhereUniqueWithoutEntryInputObjectSchema = Schema;
