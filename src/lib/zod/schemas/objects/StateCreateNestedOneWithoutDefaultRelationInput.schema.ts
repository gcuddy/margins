import { z } from 'zod';
import { StateCreateWithoutDefaultRelationInputObjectSchema } from './StateCreateWithoutDefaultRelationInput.schema';
import { StateUncheckedCreateWithoutDefaultRelationInputObjectSchema } from './StateUncheckedCreateWithoutDefaultRelationInput.schema';
import { StateCreateOrConnectWithoutDefaultRelationInputObjectSchema } from './StateCreateOrConnectWithoutDefaultRelationInput.schema';
import { StateWhereUniqueInputObjectSchema } from './StateWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateCreateNestedOneWithoutDefaultRelationInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => StateCreateWithoutDefaultRelationInputObjectSchema),
				z.lazy(() => StateUncheckedCreateWithoutDefaultRelationInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => StateCreateOrConnectWithoutDefaultRelationInputObjectSchema)
			.optional(),
		connect: z.lazy(() => StateWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const StateCreateNestedOneWithoutDefaultRelationInputObjectSchema = Schema;
