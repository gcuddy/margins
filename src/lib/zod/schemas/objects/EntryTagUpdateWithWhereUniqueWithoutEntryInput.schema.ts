import { z } from 'zod';
import { EntryTagWhereUniqueInputObjectSchema } from './EntryTagWhereUniqueInput.schema';
import { EntryTagUpdateWithoutEntryInputObjectSchema } from './EntryTagUpdateWithoutEntryInput.schema';
import { EntryTagUncheckedUpdateWithoutEntryInputObjectSchema } from './EntryTagUncheckedUpdateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagUpdateWithWhereUniqueWithoutEntryInput> = z
	.object({
		where: z.lazy(() => EntryTagWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => EntryTagUpdateWithoutEntryInputObjectSchema),
			z.lazy(() => EntryTagUncheckedUpdateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const EntryTagUpdateWithWhereUniqueWithoutEntryInputObjectSchema = Schema;
