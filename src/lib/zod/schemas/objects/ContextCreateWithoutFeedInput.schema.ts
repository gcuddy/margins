import { z } from 'zod';
import { UserCreateNestedOneWithoutContextInputObjectSchema } from './UserCreateNestedOneWithoutContextInput.schema';
import { EntryCreateNestedOneWithoutContextInputObjectSchema } from './EntryCreateNestedOneWithoutContextInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextCreateWithoutFeedInput> = z
	.object({
		createdAt: z.date().optional(),
		user: z.lazy(() => UserCreateNestedOneWithoutContextInputObjectSchema),
		entry: z.lazy(() => EntryCreateNestedOneWithoutContextInputObjectSchema).optional(),
		url: z.string().optional().nullable(),
		description: z.string().optional().nullable(),
	})
	.strict();

export const ContextCreateWithoutFeedInputObjectSchema = Schema;
