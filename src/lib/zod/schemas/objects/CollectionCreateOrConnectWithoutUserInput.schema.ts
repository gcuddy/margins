import { z } from 'zod';
import { CollectionWhereUniqueInputObjectSchema } from './CollectionWhereUniqueInput.schema';
import { CollectionCreateWithoutUserInputObjectSchema } from './CollectionCreateWithoutUserInput.schema';
import { CollectionUncheckedCreateWithoutUserInputObjectSchema } from './CollectionUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionCreateOrConnectWithoutUserInput> = z
	.object({
		where: z.lazy(() => CollectionWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => CollectionCreateWithoutUserInputObjectSchema),
			z.lazy(() => CollectionUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const CollectionCreateOrConnectWithoutUserInputObjectSchema = Schema;
