import { z } from 'zod';
import { CollectionItemsCreateWithoutAnnotationInputObjectSchema } from './CollectionItemsCreateWithoutAnnotationInput.schema';
import { CollectionItemsUncheckedCreateWithoutAnnotationInputObjectSchema } from './CollectionItemsUncheckedCreateWithoutAnnotationInput.schema';
import { CollectionItemsCreateOrConnectWithoutAnnotationInputObjectSchema } from './CollectionItemsCreateOrConnectWithoutAnnotationInput.schema';
import { CollectionItemsWhereUniqueInputObjectSchema } from './CollectionItemsWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsCreateNestedOneWithoutAnnotationInput> = z
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
		connect: z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const CollectionItemsCreateNestedOneWithoutAnnotationInputObjectSchema = Schema;
