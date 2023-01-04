import { z } from 'zod';
import { TagCreateNestedOneWithoutEntryTagsInputObjectSchema } from './TagCreateNestedOneWithoutEntryTagsInput.schema';
import { EntryCreateNestedOneWithoutEntrytagsInputObjectSchema } from './EntryCreateNestedOneWithoutEntrytagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagCreateWithoutUserInput> = z
	.object({
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		tag: z.lazy(() => TagCreateNestedOneWithoutEntryTagsInputObjectSchema),
		entry: z.lazy(() => EntryCreateNestedOneWithoutEntrytagsInputObjectSchema),
	})
	.strict();

export const EntryTagCreateWithoutUserInputObjectSchema = Schema;
