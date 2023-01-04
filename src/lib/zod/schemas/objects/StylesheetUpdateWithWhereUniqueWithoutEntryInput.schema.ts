import { z } from 'zod';
import { StylesheetWhereUniqueInputObjectSchema } from './StylesheetWhereUniqueInput.schema';
import { StylesheetUpdateWithoutEntryInputObjectSchema } from './StylesheetUpdateWithoutEntryInput.schema';
import { StylesheetUncheckedUpdateWithoutEntryInputObjectSchema } from './StylesheetUncheckedUpdateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetUpdateWithWhereUniqueWithoutEntryInput> = z
	.object({
		where: z.lazy(() => StylesheetWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => StylesheetUpdateWithoutEntryInputObjectSchema),
			z.lazy(() => StylesheetUncheckedUpdateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const StylesheetUpdateWithWhereUniqueWithoutEntryInputObjectSchema = Schema;
