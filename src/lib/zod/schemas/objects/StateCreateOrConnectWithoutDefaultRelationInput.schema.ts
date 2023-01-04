import { z } from 'zod';
import { StateWhereUniqueInputObjectSchema } from './StateWhereUniqueInput.schema';
import { StateCreateWithoutDefaultRelationInputObjectSchema } from './StateCreateWithoutDefaultRelationInput.schema';
import { StateUncheckedCreateWithoutDefaultRelationInputObjectSchema } from './StateUncheckedCreateWithoutDefaultRelationInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateCreateOrConnectWithoutDefaultRelationInput> = z
	.object({
		where: z.lazy(() => StateWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => StateCreateWithoutDefaultRelationInputObjectSchema),
			z.lazy(() => StateUncheckedCreateWithoutDefaultRelationInputObjectSchema),
		]),
	})
	.strict();

export const StateCreateOrConnectWithoutDefaultRelationInputObjectSchema = Schema;
