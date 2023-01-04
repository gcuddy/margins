import { z } from 'zod';
import { TagCreateNestedOneWithoutEntryTagsInputObjectSchema } from './TagCreateNestedOneWithoutEntryTagsInput.schema';
import { UserCreateNestedOneWithoutEntryTagInputObjectSchema } from './UserCreateNestedOneWithoutEntryTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagCreateWithoutEntryInput> = z
	.object({
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		tag: z.lazy(() => TagCreateNestedOneWithoutEntryTagsInputObjectSchema),
		user: z.lazy(() => UserCreateNestedOneWithoutEntryTagInputObjectSchema),
	})
	.strict();

export const EntryTagCreateWithoutEntryInputObjectSchema = Schema;
