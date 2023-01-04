import { z } from 'zod';
import { StylesheetWhereInputObjectSchema } from './StylesheetWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetListRelationFilter> = z
	.object({
		every: z.lazy(() => StylesheetWhereInputObjectSchema).optional(),
		some: z.lazy(() => StylesheetWhereInputObjectSchema).optional(),
		none: z.lazy(() => StylesheetWhereInputObjectSchema).optional(),
	})
	.strict();

export const StylesheetListRelationFilterObjectSchema = Schema;
