import { z } from 'zod';
import { StylesheetUpdateInputObjectSchema } from './objects/StylesheetUpdateInput.schema';
import { StylesheetUncheckedUpdateInputObjectSchema } from './objects/StylesheetUncheckedUpdateInput.schema';
import { StylesheetWhereUniqueInputObjectSchema } from './objects/StylesheetWhereUniqueInput.schema';

export const StylesheetUpdateOneSchema = z.object({
	data: z.union([StylesheetUpdateInputObjectSchema, StylesheetUncheckedUpdateInputObjectSchema]),
	where: StylesheetWhereUniqueInputObjectSchema,
});
