import { z } from 'zod';
import { EntryDataUpdateWithoutMediaInputObjectSchema } from './EntryDataUpdateWithoutMediaInput.schema';
import { EntryDataUncheckedUpdateWithoutMediaInputObjectSchema } from './EntryDataUncheckedUpdateWithoutMediaInput.schema';
import { EntryDataCreateWithoutMediaInputObjectSchema } from './EntryDataCreateWithoutMediaInput.schema';
import { EntryDataUncheckedCreateWithoutMediaInputObjectSchema } from './EntryDataUncheckedCreateWithoutMediaInput.schema';
import { EntryDataWhereInputObjectSchema } from './EntryDataWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataUpsertWithoutMediaInput> = z
	.object({
		update: z.union([
			z.lazy(() => EntryDataUpdateWithoutMediaInputObjectSchema),
			z.lazy(() => EntryDataUncheckedUpdateWithoutMediaInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => EntryDataCreateWithoutMediaInputObjectSchema),
			z.lazy(() => EntryDataUncheckedCreateWithoutMediaInputObjectSchema),
		]),
		where: z.lazy(() => EntryDataWhereInputObjectSchema).optional(),
	})
	.strict();

export const EntryDataUpsertWithoutMediaInputObjectSchema = Schema;
