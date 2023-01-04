import { z } from 'zod';
import { EntryTagScalarWhereInputObjectSchema } from './EntryTagScalarWhereInput.schema';
import { EntryTagUpdateManyMutationInputObjectSchema } from './EntryTagUpdateManyMutationInput.schema';
import { EntryTagUncheckedUpdateManyWithoutEntryTagInputObjectSchema } from './EntryTagUncheckedUpdateManyWithoutEntryTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagUpdateManyWithWhereWithoutUserInput> = z
	.object({
		where: z.lazy(() => EntryTagScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => EntryTagUpdateManyMutationInputObjectSchema),
			z.lazy(() => EntryTagUncheckedUpdateManyWithoutEntryTagInputObjectSchema),
		]),
	})
	.strict();

export const EntryTagUpdateManyWithWhereWithoutUserInputObjectSchema = Schema;
