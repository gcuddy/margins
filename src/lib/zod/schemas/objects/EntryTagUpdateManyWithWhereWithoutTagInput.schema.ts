import { z } from 'zod';
import { EntryTagScalarWhereInputObjectSchema } from './EntryTagScalarWhereInput.schema';
import { EntryTagUpdateManyMutationInputObjectSchema } from './EntryTagUpdateManyMutationInput.schema';
import { EntryTagUncheckedUpdateManyWithoutEntryTagsInputObjectSchema } from './EntryTagUncheckedUpdateManyWithoutEntryTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagUpdateManyWithWhereWithoutTagInput> = z
	.object({
		where: z.lazy(() => EntryTagScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => EntryTagUpdateManyMutationInputObjectSchema),
			z.lazy(() => EntryTagUncheckedUpdateManyWithoutEntryTagsInputObjectSchema),
		]),
	})
	.strict();

export const EntryTagUpdateManyWithWhereWithoutTagInputObjectSchema = Schema;
