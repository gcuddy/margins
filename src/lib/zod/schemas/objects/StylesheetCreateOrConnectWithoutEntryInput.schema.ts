import { z } from 'zod';
import { StylesheetWhereUniqueInputObjectSchema } from './StylesheetWhereUniqueInput.schema';
import { StylesheetCreateWithoutEntryInputObjectSchema } from './StylesheetCreateWithoutEntryInput.schema';
import { StylesheetUncheckedCreateWithoutEntryInputObjectSchema } from './StylesheetUncheckedCreateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetCreateOrConnectWithoutEntryInput> = z
	.object({
		where: z.lazy(() => StylesheetWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => StylesheetCreateWithoutEntryInputObjectSchema),
			z.lazy(() => StylesheetUncheckedCreateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const StylesheetCreateOrConnectWithoutEntryInputObjectSchema = Schema;
