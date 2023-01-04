import { z } from 'zod';
import { EntryUpdateWithoutAnnotationsInputObjectSchema } from './EntryUpdateWithoutAnnotationsInput.schema';
import { EntryUncheckedUpdateWithoutAnnotationsInputObjectSchema } from './EntryUncheckedUpdateWithoutAnnotationsInput.schema';
import { EntryCreateWithoutAnnotationsInputObjectSchema } from './EntryCreateWithoutAnnotationsInput.schema';
import { EntryUncheckedCreateWithoutAnnotationsInputObjectSchema } from './EntryUncheckedCreateWithoutAnnotationsInput.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpsertWithoutAnnotationsInput> = z
	.object({
		update: z.union([
			z.lazy(() => EntryUpdateWithoutAnnotationsInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutAnnotationsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => EntryCreateWithoutAnnotationsInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutAnnotationsInputObjectSchema),
		]),
		where: z.lazy(() => EntryWhereInputObjectSchema).optional(),
	})
	.strict();

export const EntryUpsertWithoutAnnotationsInputObjectSchema = Schema;
