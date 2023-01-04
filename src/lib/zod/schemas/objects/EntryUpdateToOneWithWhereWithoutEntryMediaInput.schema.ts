import { z } from 'zod';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';
import { EntryUpdateWithoutEntryMediaInputObjectSchema } from './EntryUpdateWithoutEntryMediaInput.schema';
import { EntryUncheckedUpdateWithoutEntryMediaInputObjectSchema } from './EntryUncheckedUpdateWithoutEntryMediaInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpdateToOneWithWhereWithoutEntryMediaInput> = z
	.object({
		where: z.lazy(() => EntryWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => EntryUpdateWithoutEntryMediaInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutEntryMediaInputObjectSchema),
		]),
	})
	.strict();

export const EntryUpdateToOneWithWhereWithoutEntryMediaInputObjectSchema = Schema;
