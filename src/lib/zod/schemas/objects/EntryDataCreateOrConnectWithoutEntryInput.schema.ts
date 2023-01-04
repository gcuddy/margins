import { z } from 'zod';
import { EntryDataWhereUniqueInputObjectSchema } from './EntryDataWhereUniqueInput.schema';
import { EntryDataCreateWithoutEntryInputObjectSchema } from './EntryDataCreateWithoutEntryInput.schema';
import { EntryDataUncheckedCreateWithoutEntryInputObjectSchema } from './EntryDataUncheckedCreateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataCreateOrConnectWithoutEntryInput> = z
	.object({
		where: z.lazy(() => EntryDataWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => EntryDataCreateWithoutEntryInputObjectSchema),
			z.lazy(() => EntryDataUncheckedCreateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const EntryDataCreateOrConnectWithoutEntryInputObjectSchema = Schema;
