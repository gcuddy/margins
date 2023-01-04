import { z } from 'zod';
import { StylesheetWhereUniqueInputObjectSchema } from './StylesheetWhereUniqueInput.schema';
import { StylesheetUpdateWithoutEntryInputObjectSchema } from './StylesheetUpdateWithoutEntryInput.schema';
import { StylesheetUncheckedUpdateWithoutEntryInputObjectSchema } from './StylesheetUncheckedUpdateWithoutEntryInput.schema';
import { StylesheetCreateWithoutEntryInputObjectSchema } from './StylesheetCreateWithoutEntryInput.schema';
import { StylesheetUncheckedCreateWithoutEntryInputObjectSchema } from './StylesheetUncheckedCreateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetUpsertWithWhereUniqueWithoutEntryInput> = z
	.object({
		where: z.lazy(() => StylesheetWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => StylesheetUpdateWithoutEntryInputObjectSchema),
			z.lazy(() => StylesheetUncheckedUpdateWithoutEntryInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => StylesheetCreateWithoutEntryInputObjectSchema),
			z.lazy(() => StylesheetUncheckedCreateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const StylesheetUpsertWithWhereUniqueWithoutEntryInputObjectSchema = Schema;
