import { z } from 'zod';
import { StylesheetWhereUniqueInputObjectSchema } from './StylesheetWhereUniqueInput.schema';
import { StylesheetUpdateWithoutUserInputObjectSchema } from './StylesheetUpdateWithoutUserInput.schema';
import { StylesheetUncheckedUpdateWithoutUserInputObjectSchema } from './StylesheetUncheckedUpdateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetUpdateWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => StylesheetWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => StylesheetUpdateWithoutUserInputObjectSchema),
			z.lazy(() => StylesheetUncheckedUpdateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const StylesheetUpdateWithWhereUniqueWithoutUserInputObjectSchema = Schema;
