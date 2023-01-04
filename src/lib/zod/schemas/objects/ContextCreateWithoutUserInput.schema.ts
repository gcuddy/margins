import { z } from 'zod';
import { EntryCreateNestedOneWithoutContextInputObjectSchema } from './EntryCreateNestedOneWithoutContextInput.schema';
import { FeedCreateNestedOneWithoutContextInputObjectSchema } from './FeedCreateNestedOneWithoutContextInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextCreateWithoutUserInput> = z
	.object({
		createdAt: z.date().optional(),
		entry: z.lazy(() => EntryCreateNestedOneWithoutContextInputObjectSchema).optional(),
		feed: z.lazy(() => FeedCreateNestedOneWithoutContextInputObjectSchema).optional(),
		url: z.string().optional().nullable(),
		description: z.string().optional().nullable(),
	})
	.strict();

export const ContextCreateWithoutUserInputObjectSchema = Schema;
