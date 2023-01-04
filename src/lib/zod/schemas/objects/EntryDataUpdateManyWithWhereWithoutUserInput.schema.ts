import { z } from 'zod';
import { EntryDataScalarWhereInputObjectSchema } from './EntryDataScalarWhereInput.schema';
import { EntryDataUpdateManyMutationInputObjectSchema } from './EntryDataUpdateManyMutationInput.schema';
import { EntryDataUncheckedUpdateManyWithoutDocumentDataInputObjectSchema } from './EntryDataUncheckedUpdateManyWithoutDocumentDataInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataUpdateManyWithWhereWithoutUserInput> = z
	.object({
		where: z.lazy(() => EntryDataScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => EntryDataUpdateManyMutationInputObjectSchema),
			z.lazy(() => EntryDataUncheckedUpdateManyWithoutDocumentDataInputObjectSchema),
		]),
	})
	.strict();

export const EntryDataUpdateManyWithWhereWithoutUserInputObjectSchema = Schema;
