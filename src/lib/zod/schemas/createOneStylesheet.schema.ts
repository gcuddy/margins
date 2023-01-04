import { z } from 'zod';
import { StylesheetCreateInputObjectSchema } from './objects/StylesheetCreateInput.schema';
import { StylesheetUncheckedCreateInputObjectSchema } from './objects/StylesheetUncheckedCreateInput.schema';

export const StylesheetCreateOneSchema = z.object({
	data: z.union([StylesheetCreateInputObjectSchema, StylesheetUncheckedCreateInputObjectSchema]),
});
