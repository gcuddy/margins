import { z } from 'zod';
import { CollectionWhereUniqueInputObjectSchema } from './CollectionWhereUniqueInput.schema';
import { CollectionUpdateWithoutUserInputObjectSchema } from './CollectionUpdateWithoutUserInput.schema';
import { CollectionUncheckedUpdateWithoutUserInputObjectSchema } from './CollectionUncheckedUpdateWithoutUserInput.schema';
import { CollectionCreateWithoutUserInputObjectSchema } from './CollectionCreateWithoutUserInput.schema';
import { CollectionUncheckedCreateWithoutUserInputObjectSchema } from './CollectionUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionUpsertWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => CollectionWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => CollectionUpdateWithoutUserInputObjectSchema),
			z.lazy(() => CollectionUncheckedUpdateWithoutUserInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => CollectionCreateWithoutUserInputObjectSchema),
			z.lazy(() => CollectionUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const CollectionUpsertWithWhereUniqueWithoutUserInputObjectSchema = Schema;
