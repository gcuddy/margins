import { z } from 'zod';
import { EntryTagScalarWhereInputObjectSchema } from './EntryTagScalarWhereInput.schema';
import { EntryTagUpdateManyMutationInputObjectSchema } from './EntryTagUpdateManyMutationInput.schema';
import { EntryTagUncheckedUpdateManyWithoutEntrytagsInputObjectSchema } from './EntryTagUncheckedUpdateManyWithoutEntrytagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagUpdateManyWithWhereWithoutEntryInput> = z
	.object({
		where: z.lazy(() => EntryTagScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => EntryTagUpdateManyMutationInputObjectSchema),
			z.lazy(() => EntryTagUncheckedUpdateManyWithoutEntrytagsInputObjectSchema),
		]),
	})
	.strict();

export const EntryTagUpdateManyWithWhereWithoutEntryInputObjectSchema = Schema;
