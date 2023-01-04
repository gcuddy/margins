import { z } from 'zod';
import { SmartListCreateWithoutFavoriteInputObjectSchema } from './SmartListCreateWithoutFavoriteInput.schema';
import { SmartListUncheckedCreateWithoutFavoriteInputObjectSchema } from './SmartListUncheckedCreateWithoutFavoriteInput.schema';
import { SmartListCreateOrConnectWithoutFavoriteInputObjectSchema } from './SmartListCreateOrConnectWithoutFavoriteInput.schema';
import { SmartListUpsertWithoutFavoriteInputObjectSchema } from './SmartListUpsertWithoutFavoriteInput.schema';
import { SmartListWhereInputObjectSchema } from './SmartListWhereInput.schema';
import { SmartListWhereUniqueInputObjectSchema } from './SmartListWhereUniqueInput.schema';
import { SmartListUpdateToOneWithWhereWithoutFavoriteInputObjectSchema } from './SmartListUpdateToOneWithWhereWithoutFavoriteInput.schema';
import { SmartListUpdateWithoutFavoriteInputObjectSchema } from './SmartListUpdateWithoutFavoriteInput.schema';
import { SmartListUncheckedUpdateWithoutFavoriteInputObjectSchema } from './SmartListUncheckedUpdateWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SmartListUpdateOneWithoutFavoriteNestedInput> = z
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
		upsert: z.lazy(() => SmartListUpsertWithoutFavoriteInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => SmartListWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => SmartListWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => SmartListWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => SmartListUpdateToOneWithWhereWithoutFavoriteInputObjectSchema),
				z.lazy(() => SmartListUpdateWithoutFavoriteInputObjectSchema),
				z.lazy(() => SmartListUncheckedUpdateWithoutFavoriteInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const SmartListUpdateOneWithoutFavoriteNestedInputObjectSchema = Schema;
