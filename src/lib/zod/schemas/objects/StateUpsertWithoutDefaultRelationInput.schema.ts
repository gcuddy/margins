import { z } from 'zod';
import { StateUpdateWithoutDefaultRelationInputObjectSchema } from './StateUpdateWithoutDefaultRelationInput.schema';
import { StateUncheckedUpdateWithoutDefaultRelationInputObjectSchema } from './StateUncheckedUpdateWithoutDefaultRelationInput.schema';
import { StateCreateWithoutDefaultRelationInputObjectSchema } from './StateCreateWithoutDefaultRelationInput.schema';
import { StateUncheckedCreateWithoutDefaultRelationInputObjectSchema } from './StateUncheckedCreateWithoutDefaultRelationInput.schema';
import { StateWhereInputObjectSchema } from './StateWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateUpsertWithoutDefaultRelationInput> = z
	.object({
		update: z.union([
			z.lazy(() => StateUpdateWithoutDefaultRelationInputObjectSchema),
			z.lazy(() => StateUncheckedUpdateWithoutDefaultRelationInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => StateCreateWithoutDefaultRelationInputObjectSchema),
			z.lazy(() => StateUncheckedCreateWithoutDefaultRelationInputObjectSchema),
		]),
		where: z.lazy(() => StateWhereInputObjectSchema).optional(),
	})
	.strict();

export const StateUpsertWithoutDefaultRelationInputObjectSchema = Schema;
