import { z } from 'zod';
import { EntryScalarWhereInputObjectSchema } from './EntryScalarWhereInput.schema';
import { EntryUpdateManyMutationInputObjectSchema } from './EntryUpdateManyMutationInput.schema';
import { EntryUncheckedUpdateManyWithoutEntriesInputObjectSchema } from './EntryUncheckedUpdateManyWithoutEntriesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpdateManyWithWhereWithoutTagsInput> = z
	.object({
		where: z.lazy(() => EntryScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => EntryUpdateManyMutationInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateManyWithoutEntriesInputObjectSchema),
		]),
	})
	.strict();

export const EntryUpdateManyWithWhereWithoutTagsInputObjectSchema = Schema;
