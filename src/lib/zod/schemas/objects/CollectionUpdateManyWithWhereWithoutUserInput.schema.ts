import { z } from 'zod';
import { CollectionScalarWhereInputObjectSchema } from './CollectionScalarWhereInput.schema';
import { CollectionUpdateManyMutationInputObjectSchema } from './CollectionUpdateManyMutationInput.schema';
import { CollectionUncheckedUpdateManyWithoutCollectionsInputObjectSchema } from './CollectionUncheckedUpdateManyWithoutCollectionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionUpdateManyWithWhereWithoutUserInput> = z
	.object({
		where: z.lazy(() => CollectionScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => CollectionUpdateManyMutationInputObjectSchema),
			z.lazy(() => CollectionUncheckedUpdateManyWithoutCollectionsInputObjectSchema),
		]),
	})
	.strict();

export const CollectionUpdateManyWithWhereWithoutUserInputObjectSchema = Schema;
