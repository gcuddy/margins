import { z } from 'zod';
import { UserCreateNestedOneWithoutContextInputObjectSchema } from './UserCreateNestedOneWithoutContextInput.schema';
import { FeedCreateNestedOneWithoutContextInputObjectSchema } from './FeedCreateNestedOneWithoutContextInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextCreateWithoutEntryInput> = z
	.object({
		createdAt: z.date().optional(),
		user: z.lazy(() => UserCreateNestedOneWithoutContextInputObjectSchema),
		feed: z.lazy(() => FeedCreateNestedOneWithoutContextInputObjectSchema).optional(),
		url: z.string().optional().nullable(),
		description: z.string().optional().nullable(),
	})
	.strict();

export const ContextCreateWithoutEntryInputObjectSchema = Schema;
