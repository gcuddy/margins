import { z } from 'zod';
import { CollectionItemsWhereInputObjectSchema } from './CollectionItemsWhereInput.schema';
import { CollectionItemsUpdateWithoutAnnotationInputObjectSchema } from './CollectionItemsUpdateWithoutAnnotationInput.schema';
import { CollectionItemsUncheckedUpdateWithoutAnnotationInputObjectSchema } from './CollectionItemsUncheckedUpdateWithoutAnnotationInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsUpdateToOneWithWhereWithoutAnnotationInput> = z
	.object({
		where: z.lazy(() => CollectionItemsWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => CollectionItemsUpdateWithoutAnnotationInputObjectSchema),
			z.lazy(() => CollectionItemsUncheckedUpdateWithoutAnnotationInputObjectSchema),
		]),
	})
	.strict();

export const CollectionItemsUpdateToOneWithWhereWithoutAnnotationInputObjectSchema = Schema;
