import { z } from 'zod';
import { EntryDataWhereUniqueInputObjectSchema } from './EntryDataWhereUniqueInput.schema';
import { EntryDataUpdateWithoutUserInputObjectSchema } from './EntryDataUpdateWithoutUserInput.schema';
import { EntryDataUncheckedUpdateWithoutUserInputObjectSchema } from './EntryDataUncheckedUpdateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataUpdateWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => EntryDataWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => EntryDataUpdateWithoutUserInputObjectSchema),
			z.lazy(() => EntryDataUncheckedUpdateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const EntryDataUpdateWithWhereUniqueWithoutUserInputObjectSchema = Schema;
