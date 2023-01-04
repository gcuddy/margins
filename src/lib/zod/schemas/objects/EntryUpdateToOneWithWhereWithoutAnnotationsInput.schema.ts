import { z } from 'zod';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';
import { EntryUpdateWithoutAnnotationsInputObjectSchema } from './EntryUpdateWithoutAnnotationsInput.schema';
import { EntryUncheckedUpdateWithoutAnnotationsInputObjectSchema } from './EntryUncheckedUpdateWithoutAnnotationsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpdateToOneWithWhereWithoutAnnotationsInput> = z
	.object({
		where: z.lazy(() => EntryWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => EntryUpdateWithoutAnnotationsInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutAnnotationsInputObjectSchema),
		]),
	})
	.strict();

export const EntryUpdateToOneWithWhereWithoutAnnotationsInputObjectSchema = Schema;
