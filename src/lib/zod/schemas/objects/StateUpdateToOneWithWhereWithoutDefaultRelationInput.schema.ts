import { z } from 'zod';
import { StateWhereInputObjectSchema } from './StateWhereInput.schema';
import { StateUpdateWithoutDefaultRelationInputObjectSchema } from './StateUpdateWithoutDefaultRelationInput.schema';
import { StateUncheckedUpdateWithoutDefaultRelationInputObjectSchema } from './StateUncheckedUpdateWithoutDefaultRelationInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateUpdateToOneWithWhereWithoutDefaultRelationInput> = z
	.object({
		where: z.lazy(() => StateWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => StateUpdateWithoutDefaultRelationInputObjectSchema),
			z.lazy(() => StateUncheckedUpdateWithoutDefaultRelationInputObjectSchema),
		]),
	})
	.strict();

export const StateUpdateToOneWithWhereWithoutDefaultRelationInputObjectSchema = Schema;
