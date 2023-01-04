import { z } from 'zod';
import { EntryCreateNestedOneWithoutEntrytagsInputObjectSchema } from './EntryCreateNestedOneWithoutEntrytagsInput.schema';
import { UserCreateNestedOneWithoutEntryTagInputObjectSchema } from './UserCreateNestedOneWithoutEntryTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagCreateWithoutTagInput> = z
	.object({
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		entry: z.lazy(() => EntryCreateNestedOneWithoutEntrytagsInputObjectSchema),
		user: z.lazy(() => UserCreateNestedOneWithoutEntryTagInputObjectSchema),
	})
	.strict();

export const EntryTagCreateWithoutTagInputObjectSchema = Schema;
