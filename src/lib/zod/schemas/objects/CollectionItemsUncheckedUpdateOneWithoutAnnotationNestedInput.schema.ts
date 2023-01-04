import { z } from 'zod';
import { CollectionItemsCreateWithoutAnnotationInputObjectSchema } from './CollectionItemsCreateWithoutAnnotationInput.schema';
import { CollectionItemsUncheckedCreateWithoutAnnotationInputObjectSchema } from './CollectionItemsUncheckedCreateWithoutAnnotationInput.schema';
import { CollectionItemsCreateOrConnectWithoutAnnotationInputObjectSchema } from './CollectionItemsCreateOrConnectWithoutAnnotationInput.schema';
import { CollectionItemsUpsertWithoutAnnotationInputObjectSchema } from './CollectionItemsUpsertWithoutAnnotationInput.schema';
import { CollectionItemsWhereInputObjectSchema } from './CollectionItemsWhereInput.schema';
import { CollectionItemsWhereUniqueInputObjectSchema } from './CollectionItemsWhereUniqueInput.schema';
import { CollectionItemsUpdateToOneWithWhereWithoutAnnotationInputObjectSchema } from './CollectionItemsUpdateToOneWithWhereWithoutAnnotationInput.schema';
import { CollectionItemsUpdateWithoutAnnotationInputObjectSchema } from './CollectionItemsUpdateWithoutAnnotationInput.schema';
import { CollectionItemsUncheckedUpdateWithoutAnnotationInputObjectSchema } from './CollectionItemsUncheckedUpdateWithoutAnnotationInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsUncheckedUpdateOneWithoutAnnotationNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => CollectionItemsCreateWithoutAnnotationInputObjectSchema),
				z.lazy(() => CollectionItemsUncheckedCreateWithoutAnnotationInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => CollectionItemsCreateOrConnectWithoutAnnotationInputObjectSchema)
			.optional(),
		upsert: z.lazy(() => CollectionItemsUpsertWithoutAnnotationInputObjectSchema).optional(),
		disconnect: z
			.union([z.boolean(), z.lazy(() => CollectionItemsWhereInputObjectSchema)])
			.optional(),
		delete: z.union([z.boolean(), z.lazy(() => CollectionItemsWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => CollectionItemsUpdateToOneWithWhereWithoutAnnotationInputObjectSchema),
				z.lazy(() => CollectionItemsUpdateWithoutAnnotationInputObjectSchema),
				z.lazy(() => CollectionItemsUncheckedUpdateWithoutAnnotationInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const CollectionItemsUncheckedUpdateOneWithoutAnnotationNestedInputObjectSchema = Schema;
