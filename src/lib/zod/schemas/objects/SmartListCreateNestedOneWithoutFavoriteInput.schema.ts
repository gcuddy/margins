import { z } from 'zod';
import { SmartListCreateWithoutFavoriteInputObjectSchema } from './SmartListCreateWithoutFavoriteInput.schema';
import { SmartListUncheckedCreateWithoutFavoriteInputObjectSchema } from './SmartListUncheckedCreateWithoutFavoriteInput.schema';
import { SmartListCreateOrConnectWithoutFavoriteInputObjectSchema } from './SmartListCreateOrConnectWithoutFavoriteInput.schema';
import { SmartListWhereUniqueInputObjectSchema } from './SmartListWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SmartListCreateNestedOneWithoutFavoriteInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => SmartListCreateWithoutFavoriteInputObjectSchema),
				z.lazy(() => SmartListUncheckedCreateWithoutFavoriteInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => SmartListCreateOrConnectWithoutFavoriteInputObjectSchema)
			.optional(),
		connect: z.lazy(() => SmartListWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const SmartListCreateNestedOneWithoutFavoriteInputObjectSchema = Schema;
