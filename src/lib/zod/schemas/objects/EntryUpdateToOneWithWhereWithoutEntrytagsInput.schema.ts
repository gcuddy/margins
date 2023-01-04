import { z } from 'zod';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';
import { EntryUpdateWithoutEntrytagsInputObjectSchema } from './EntryUpdateWithoutEntrytagsInput.schema';
import { EntryUncheckedUpdateWithoutEntrytagsInputObjectSchema } from './EntryUncheckedUpdateWithoutEntrytagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpdateToOneWithWhereWithoutEntrytagsInput> = z
	.object({
		where: z.lazy(() => EntryWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => EntryUpdateWithoutEntrytagsInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutEntrytagsInputObjectSchema),
		]),
	})
	.strict();

export const EntryUpdateToOneWithWhereWithoutEntrytagsInputObjectSchema = Schema;
