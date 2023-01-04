import { z } from 'zod';
import { LocationSchema } from '../enums/Location.schema';
import { BookmarkUncheckedCreateNestedManyWithoutStateInputObjectSchema } from './BookmarkUncheckedCreateNestedManyWithoutStateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateUncheckedCreateWithoutDefaultRelationInput> = z
	.object({
		id: z.number().optional(),
		read_later: z.boolean(),
		name: z.string(),
		color: z.string().optional().nullable(),
		type: z.lazy(() => LocationSchema),
		position: z.number(),
		description: z.string().optional().nullable(),
		userId: z.string(),
		default: z.boolean().optional(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		bookmarks: z
			.lazy(() => BookmarkUncheckedCreateNestedManyWithoutStateInputObjectSchema)
			.optional(),
	})
	.strict();

export const StateUncheckedCreateWithoutDefaultRelationInputObjectSchema = Schema;
