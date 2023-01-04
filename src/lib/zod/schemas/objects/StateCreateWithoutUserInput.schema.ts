import { z } from 'zod';
import { LocationSchema } from '../enums/Location.schema';
import { UserCreateNestedOneWithoutDefault_stateInputObjectSchema } from './UserCreateNestedOneWithoutDefault_stateInput.schema';
import { BookmarkCreateNestedManyWithoutStateInputObjectSchema } from './BookmarkCreateNestedManyWithoutStateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateCreateWithoutUserInput> = z
	.object({
		read_later: z.boolean(),
		name: z.string(),
		color: z.string().optional().nullable(),
		type: z.lazy(() => LocationSchema),
		position: z.number(),
		description: z.string().optional().nullable(),
		defaultRelation: z
			.lazy(() => UserCreateNestedOneWithoutDefault_stateInputObjectSchema)
			.optional(),
		default: z.boolean().optional(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutStateInputObjectSchema).optional(),
	})
	.strict();

export const StateCreateWithoutUserInputObjectSchema = Schema;
