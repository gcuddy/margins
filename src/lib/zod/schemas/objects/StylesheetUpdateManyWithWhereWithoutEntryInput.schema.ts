import { z } from 'zod';
import { StylesheetScalarWhereInputObjectSchema } from './StylesheetScalarWhereInput.schema';
import { StylesheetUpdateManyMutationInputObjectSchema } from './StylesheetUpdateManyMutationInput.schema';
import { StylesheetUncheckedUpdateManyWithoutStylesheetInputObjectSchema } from './StylesheetUncheckedUpdateManyWithoutStylesheetInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetUpdateManyWithWhereWithoutEntryInput> = z
	.object({
		where: z.lazy(() => StylesheetScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => StylesheetUpdateManyMutationInputObjectSchema),
			z.lazy(() => StylesheetUncheckedUpdateManyWithoutStylesheetInputObjectSchema),
		]),
	})
	.strict();

export const StylesheetUpdateManyWithWhereWithoutEntryInputObjectSchema = Schema;
