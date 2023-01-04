import { z } from 'zod';
import { StylesheetScalarWhereInputObjectSchema } from './StylesheetScalarWhereInput.schema';
import { StylesheetUpdateManyMutationInputObjectSchema } from './StylesheetUpdateManyMutationInput.schema';
import { StylesheetUncheckedUpdateManyWithoutStylesheetsInputObjectSchema } from './StylesheetUncheckedUpdateManyWithoutStylesheetsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetUpdateManyWithWhereWithoutUserInput> = z
	.object({
		where: z.lazy(() => StylesheetScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => StylesheetUpdateManyMutationInputObjectSchema),
			z.lazy(() => StylesheetUncheckedUpdateManyWithoutStylesheetsInputObjectSchema),
		]),
	})
	.strict();

export const StylesheetUpdateManyWithWhereWithoutUserInputObjectSchema = Schema;
