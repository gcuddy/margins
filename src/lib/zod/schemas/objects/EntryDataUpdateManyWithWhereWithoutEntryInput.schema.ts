import { z } from 'zod';
import { EntryDataScalarWhereInputObjectSchema } from './EntryDataScalarWhereInput.schema';
import { EntryDataUpdateManyMutationInputObjectSchema } from './EntryDataUpdateManyMutationInput.schema';
import { EntryDataUncheckedUpdateManyWithoutDataInputObjectSchema } from './EntryDataUncheckedUpdateManyWithoutDataInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataUpdateManyWithWhereWithoutEntryInput> = z
	.object({
		where: z.lazy(() => EntryDataScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => EntryDataUpdateManyMutationInputObjectSchema),
			z.lazy(() => EntryDataUncheckedUpdateManyWithoutDataInputObjectSchema),
		]),
	})
	.strict();

export const EntryDataUpdateManyWithWhereWithoutEntryInputObjectSchema = Schema;
