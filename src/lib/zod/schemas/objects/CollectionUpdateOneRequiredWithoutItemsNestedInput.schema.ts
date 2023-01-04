import { z } from 'zod';
import { CollectionCreateWithoutItemsInputObjectSchema } from './CollectionCreateWithoutItemsInput.schema';
import { CollectionUncheckedCreateWithoutItemsInputObjectSchema } from './CollectionUncheckedCreateWithoutItemsInput.schema';
import { CollectionCreateOrConnectWithoutItemsInputObjectSchema } from './CollectionCreateOrConnectWithoutItemsInput.schema';
import { CollectionUpsertWithoutItemsInputObjectSchema } from './CollectionUpsertWithoutItemsInput.schema';
import { CollectionWhereUniqueInputObjectSchema } from './CollectionWhereUniqueInput.schema';
import { CollectionUpdateToOneWithWhereWithoutItemsInputObjectSchema } from './CollectionUpdateToOneWithWhereWithoutItemsInput.schema';
import { CollectionUpdateWithoutItemsInputObjectSchema } from './CollectionUpdateWithoutItemsInput.schema';
import { CollectionUncheckedUpdateWithoutItemsInputObjectSchema } from './CollectionUncheckedUpdateWithoutItemsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionUpdateOneRequiredWithoutItemsNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => CollectionCreateWithoutItemsInputObjectSchema),
				z.lazy(() => CollectionUncheckedCreateWithoutItemsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => CollectionCreateOrConnectWithoutItemsInputObjectSchema)
			.optional(),
		upsert: z.lazy(() => CollectionUpsertWithoutItemsInputObjectSchema).optional(),
		connect: z.lazy(() => CollectionWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => CollectionUpdateToOneWithWhereWithoutItemsInputObjectSchema),
				z.lazy(() => CollectionUpdateWithoutItemsInputObjectSchema),
				z.lazy(() => CollectionUncheckedUpdateWithoutItemsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const CollectionUpdateOneRequiredWithoutItemsNestedInputObjectSchema = Schema;
