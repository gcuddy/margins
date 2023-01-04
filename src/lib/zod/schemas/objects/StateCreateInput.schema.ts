import { z } from 'zod';
import { LocationSchema } from '../enums/Location.schema';
import { UserCreateNestedOneWithoutStatesInputObjectSchema } from './UserCreateNestedOneWithoutStatesInput.schema';
import { UserCreateNestedOneWithoutDefault_stateInputObjectSchema } from './UserCreateNestedOneWithoutDefault_stateInput.schema';
import { BookmarkCreateNestedManyWithoutStateInputObjectSchema } from './BookmarkCreateNestedManyWithoutStateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateCreateInput> = z
	.object({
		read_later: z.boolean(),
		name: z.string(),
		color: z.string().optional().nullable(),
		type: z.lazy(() => LocationSchema),
		position: z.number(),
		description: z.string().optional().nullable(),
		user: z.lazy(() => UserCreateNestedOneWithoutStatesInputObjectSchema),
		defaultRelation: z
			.lazy(() => UserCreateNestedOneWithoutDefault_stateInputObjectSchema)
			.optional(),
		default: z.boolean().optional(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		bookmarks: z.lazy(() => BookmarkCreateNestedManyWithoutStateInputObjectSchema).optional(),
	})
	.strict();

export const StateCreateInputObjectSchema = Schema;
