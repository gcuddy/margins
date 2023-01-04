import { z } from 'zod';
import { CollectionItemsWhereUniqueInputObjectSchema } from './CollectionItemsWhereUniqueInput.schema';
import { CollectionItemsCreateWithoutAnnotationInputObjectSchema } from './CollectionItemsCreateWithoutAnnotationInput.schema';
import { CollectionItemsUncheckedCreateWithoutAnnotationInputObjectSchema } from './CollectionItemsUncheckedCreateWithoutAnnotationInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsCreateOrConnectWithoutAnnotationInput> = z
	.object({
		where: z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => CollectionItemsCreateWithoutAnnotationInputObjectSchema),
			z.lazy(() => CollectionItemsUncheckedCreateWithoutAnnotationInputObjectSchema),
		]),
	})
	.strict();

export const CollectionItemsCreateOrConnectWithoutAnnotationInputObjectSchema = Schema;
