import { z } from 'zod';
import { EntryDataWhereInputObjectSchema } from './EntryDataWhereInput.schema';
import { EntryDataUpdateWithoutMediaInputObjectSchema } from './EntryDataUpdateWithoutMediaInput.schema';
import { EntryDataUncheckedUpdateWithoutMediaInputObjectSchema } from './EntryDataUncheckedUpdateWithoutMediaInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataUpdateToOneWithWhereWithoutMediaInput> = z
	.object({
		where: z.lazy(() => EntryDataWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => EntryDataUpdateWithoutMediaInputObjectSchema),
			z.lazy(() => EntryDataUncheckedUpdateWithoutMediaInputObjectSchema),
		]),
	})
	.strict();

export const EntryDataUpdateToOneWithWhereWithoutMediaInputObjectSchema = Schema;
