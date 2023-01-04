import { z } from 'zod';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';
import { EntryUpdateWithoutDataInputObjectSchema } from './EntryUpdateWithoutDataInput.schema';
import { EntryUncheckedUpdateWithoutDataInputObjectSchema } from './EntryUncheckedUpdateWithoutDataInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpdateToOneWithWhereWithoutDataInput> = z
	.object({
		where: z.lazy(() => EntryWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => EntryUpdateWithoutDataInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutDataInputObjectSchema),
		]),
	})
	.strict();

export const EntryUpdateToOneWithWhereWithoutDataInputObjectSchema = Schema;
