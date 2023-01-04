import { z } from 'zod';
import { StateCreateWithoutDefaultRelationInputObjectSchema } from './StateCreateWithoutDefaultRelationInput.schema';
import { StateUncheckedCreateWithoutDefaultRelationInputObjectSchema } from './StateUncheckedCreateWithoutDefaultRelationInput.schema';
import { StateCreateOrConnectWithoutDefaultRelationInputObjectSchema } from './StateCreateOrConnectWithoutDefaultRelationInput.schema';
import { StateUpsertWithoutDefaultRelationInputObjectSchema } from './StateUpsertWithoutDefaultRelationInput.schema';
import { StateWhereInputObjectSchema } from './StateWhereInput.schema';
import { StateWhereUniqueInputObjectSchema } from './StateWhereUniqueInput.schema';
import { StateUpdateToOneWithWhereWithoutDefaultRelationInputObjectSchema } from './StateUpdateToOneWithWhereWithoutDefaultRelationInput.schema';
import { StateUpdateWithoutDefaultRelationInputObjectSchema } from './StateUpdateWithoutDefaultRelationInput.schema';
import { StateUncheckedUpdateWithoutDefaultRelationInputObjectSchema } from './StateUncheckedUpdateWithoutDefaultRelationInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateUpdateOneWithoutDefaultRelationNestedInput> = z
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
		upsert: z.lazy(() => StateUpsertWithoutDefaultRelationInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => StateWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => StateWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => StateWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => StateUpdateToOneWithWhereWithoutDefaultRelationInputObjectSchema),
				z.lazy(() => StateUpdateWithoutDefaultRelationInputObjectSchema),
				z.lazy(() => StateUncheckedUpdateWithoutDefaultRelationInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const StateUpdateOneWithoutDefaultRelationNestedInputObjectSchema = Schema;
