import { z } from 'zod';
import { CollectionWhereUniqueInputObjectSchema } from './CollectionWhereUniqueInput.schema';
import { CollectionUpdateWithoutUserInputObjectSchema } from './CollectionUpdateWithoutUserInput.schema';
import { CollectionUncheckedUpdateWithoutUserInputObjectSchema } from './CollectionUncheckedUpdateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionUpdateWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => CollectionWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => CollectionUpdateWithoutUserInputObjectSchema),
			z.lazy(() => CollectionUncheckedUpdateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const CollectionUpdateWithWhereUniqueWithoutUserInputObjectSchema = Schema;
