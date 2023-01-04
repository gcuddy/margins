import { z } from 'zod';
import { LocationSchema } from '../enums/Location.schema';
import { UserUncheckedCreateNestedOneWithoutDefault_stateInputObjectSchema } from './UserUncheckedCreateNestedOneWithoutDefault_stateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateUncheckedCreateWithoutBookmarksInput> = z
	.object({
		id: z.number().optional(),
		read_later: z.boolean(),
		name: z.string(),
		color: z.string().optional().nullable(),
		type: z.lazy(() => LocationSchema),
		position: z.number(),
		description: z.string().optional().nullable(),
		userId: z.string(),
		defaultRelation: z
			.lazy(() => UserUncheckedCreateNestedOneWithoutDefault_stateInputObjectSchema)
			.optional(),
		default: z.boolean().optional(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
	})
	.strict();

export const StateUncheckedCreateWithoutBookmarksInputObjectSchema = Schema;
