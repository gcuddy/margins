import { z } from 'zod';
import { TagCreateNestedOneWithoutEntryTagsInputObjectSchema } from './TagCreateNestedOneWithoutEntryTagsInput.schema';
import { EntryCreateNestedOneWithoutEntrytagsInputObjectSchema } from './EntryCreateNestedOneWithoutEntrytagsInput.schema';
import { UserCreateNestedOneWithoutEntryTagInputObjectSchema } from './UserCreateNestedOneWithoutEntryTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagCreateInput> = z
	.object({
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		tag: z.lazy(() => TagCreateNestedOneWithoutEntryTagsInputObjectSchema),
		entry: z.lazy(() => EntryCreateNestedOneWithoutEntrytagsInputObjectSchema),
		user: z.lazy(() => UserCreateNestedOneWithoutEntryTagInputObjectSchema),
	})
	.strict();

export const EntryTagCreateInputObjectSchema = Schema;
