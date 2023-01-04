import { z } from 'zod';
import { LocationSchema } from '../enums/Location.schema';
import { UserUncheckedCreateNestedOneWithoutDefault_stateInputObjectSchema } from './UserUncheckedCreateNestedOneWithoutDefault_stateInput.schema';
import { BookmarkUncheckedCreateNestedManyWithoutStateInputObjectSchema } from './BookmarkUncheckedCreateNestedManyWithoutStateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateUncheckedCreateWithoutUserInput> = z
	.object({
		id: z.number().optional(),
		read_later: z.boolean(),
		name: z.string(),
		color: z.string().optional().nullable(),
		type: z.lazy(() => LocationSchema),
		position: z.number(),
		description: z.string().optional().nullable(),
		defaultRelation: z
			.lazy(() => UserUncheckedCreateNestedOneWithoutDefault_stateInputObjectSchema)
			.optional(),
		default: z.boolean().optional(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		bookmarks: z
			.lazy(() => BookmarkUncheckedCreateNestedManyWithoutStateInputObjectSchema)
			.optional(),
	})
	.strict();

export const StateUncheckedCreateWithoutUserInputObjectSchema = Schema;
