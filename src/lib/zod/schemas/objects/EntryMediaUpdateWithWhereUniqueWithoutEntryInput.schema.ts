import { z } from 'zod';
import { EntryMediaWhereUniqueInputObjectSchema } from './EntryMediaWhereUniqueInput.schema';
import { EntryMediaUpdateWithoutEntryInputObjectSchema } from './EntryMediaUpdateWithoutEntryInput.schema';
import { EntryMediaUncheckedUpdateWithoutEntryInputObjectSchema } from './EntryMediaUncheckedUpdateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaUpdateWithWhereUniqueWithoutEntryInput> = z
	.object({
		where: z.lazy(() => EntryMediaWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => EntryMediaUpdateWithoutEntryInputObjectSchema),
			z.lazy(() => EntryMediaUncheckedUpdateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const EntryMediaUpdateWithWhereUniqueWithoutEntryInputObjectSchema = Schema;
