import { z } from 'zod';
import { EntryDataWhereUniqueInputObjectSchema } from './EntryDataWhereUniqueInput.schema';
import { EntryDataUpdateWithoutUserInputObjectSchema } from './EntryDataUpdateWithoutUserInput.schema';
import { EntryDataUncheckedUpdateWithoutUserInputObjectSchema } from './EntryDataUncheckedUpdateWithoutUserInput.schema';
import { EntryDataCreateWithoutUserInputObjectSchema } from './EntryDataCreateWithoutUserInput.schema';
import { EntryDataUncheckedCreateWithoutUserInputObjectSchema } from './EntryDataUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataUpsertWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => EntryDataWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => EntryDataUpdateWithoutUserInputObjectSchema),
			z.lazy(() => EntryDataUncheckedUpdateWithoutUserInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => EntryDataCreateWithoutUserInputObjectSchema),
			z.lazy(() => EntryDataUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const EntryDataUpsertWithWhereUniqueWithoutUserInputObjectSchema = Schema;
