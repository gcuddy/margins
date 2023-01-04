import { z } from 'zod';
import { EntryUpdateWithoutDataInputObjectSchema } from './EntryUpdateWithoutDataInput.schema';
import { EntryUncheckedUpdateWithoutDataInputObjectSchema } from './EntryUncheckedUpdateWithoutDataInput.schema';
import { EntryCreateWithoutDataInputObjectSchema } from './EntryCreateWithoutDataInput.schema';
import { EntryUncheckedCreateWithoutDataInputObjectSchema } from './EntryUncheckedCreateWithoutDataInput.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpsertWithoutDataInput> = z
	.object({
		update: z.union([
			z.lazy(() => EntryUpdateWithoutDataInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutDataInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => EntryCreateWithoutDataInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutDataInputObjectSchema),
		]),
		where: z.lazy(() => EntryWhereInputObjectSchema).optional(),
	})
	.strict();

export const EntryUpsertWithoutDataInputObjectSchema = Schema;
