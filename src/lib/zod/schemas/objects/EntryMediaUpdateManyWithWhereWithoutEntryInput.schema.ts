import { z } from 'zod';
import { EntryMediaScalarWhereInputObjectSchema } from './EntryMediaScalarWhereInput.schema';
import { EntryMediaUpdateManyMutationInputObjectSchema } from './EntryMediaUpdateManyMutationInput.schema';
import { EntryMediaUncheckedUpdateManyWithoutEntryMediaInputObjectSchema } from './EntryMediaUncheckedUpdateManyWithoutEntryMediaInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaUpdateManyWithWhereWithoutEntryInput> = z
	.object({
		where: z.lazy(() => EntryMediaScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => EntryMediaUpdateManyMutationInputObjectSchema),
			z.lazy(() => EntryMediaUncheckedUpdateManyWithoutEntryMediaInputObjectSchema),
		]),
	})
	.strict();

export const EntryMediaUpdateManyWithWhereWithoutEntryInputObjectSchema = Schema;
