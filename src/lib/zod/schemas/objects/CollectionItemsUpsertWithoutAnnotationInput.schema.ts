import { z } from 'zod';
import { CollectionItemsUpdateWithoutAnnotationInputObjectSchema } from './CollectionItemsUpdateWithoutAnnotationInput.schema';
import { CollectionItemsUncheckedUpdateWithoutAnnotationInputObjectSchema } from './CollectionItemsUncheckedUpdateWithoutAnnotationInput.schema';
import { CollectionItemsCreateWithoutAnnotationInputObjectSchema } from './CollectionItemsCreateWithoutAnnotationInput.schema';
import { CollectionItemsUncheckedCreateWithoutAnnotationInputObjectSchema } from './CollectionItemsUncheckedCreateWithoutAnnotationInput.schema';
import { CollectionItemsWhereInputObjectSchema } from './CollectionItemsWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsUpsertWithoutAnnotationInput> = z
	.object({
		update: z.union([
			z.lazy(() => CollectionItemsUpdateWithoutAnnotationInputObjectSchema),
			z.lazy(() => CollectionItemsUncheckedUpdateWithoutAnnotationInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => CollectionItemsCreateWithoutAnnotationInputObjectSchema),
			z.lazy(() => CollectionItemsUncheckedCreateWithoutAnnotationInputObjectSchema),
		]),
		where: z.lazy(() => CollectionItemsWhereInputObjectSchema).optional(),
	})
	.strict();

export const CollectionItemsUpsertWithoutAnnotationInputObjectSchema = Schema;
