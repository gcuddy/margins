import { z } from 'zod';
import { EntryDataWhereUniqueInputObjectSchema } from './EntryDataWhereUniqueInput.schema';
import { EntryDataCreateWithoutUserInputObjectSchema } from './EntryDataCreateWithoutUserInput.schema';
import { EntryDataUncheckedCreateWithoutUserInputObjectSchema } from './EntryDataUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataCreateOrConnectWithoutUserInput> = z
	.object({
		where: z.lazy(() => EntryDataWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => EntryDataCreateWithoutUserInputObjectSchema),
			z.lazy(() => EntryDataUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const EntryDataCreateOrConnectWithoutUserInputObjectSchema = Schema;
