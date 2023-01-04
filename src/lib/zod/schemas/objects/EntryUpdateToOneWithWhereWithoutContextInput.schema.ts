import { z } from 'zod';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';
import { EntryUpdateWithoutContextInputObjectSchema } from './EntryUpdateWithoutContextInput.schema';
import { EntryUncheckedUpdateWithoutContextInputObjectSchema } from './EntryUncheckedUpdateWithoutContextInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpdateToOneWithWhereWithoutContextInput> = z
	.object({
		where: z.lazy(() => EntryWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => EntryUpdateWithoutContextInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutContextInputObjectSchema),
		]),
	})
	.strict();

export const EntryUpdateToOneWithWhereWithoutContextInputObjectSchema = Schema;
