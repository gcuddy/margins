import { z } from 'zod';
import { StylesheetWhereUniqueInputObjectSchema } from './objects/StylesheetWhereUniqueInput.schema';
import { StylesheetCreateInputObjectSchema } from './objects/StylesheetCreateInput.schema';
import { StylesheetUncheckedCreateInputObjectSchema } from './objects/StylesheetUncheckedCreateInput.schema';
import { StylesheetUpdateInputObjectSchema } from './objects/StylesheetUpdateInput.schema';
import { StylesheetUncheckedUpdateInputObjectSchema } from './objects/StylesheetUncheckedUpdateInput.schema';

export const StylesheetUpsertSchema = z.object({
	where: StylesheetWhereUniqueInputObjectSchema,
	create: z.union([StylesheetCreateInputObjectSchema, StylesheetUncheckedCreateInputObjectSchema]),
	update: z.union([StylesheetUpdateInputObjectSchema, StylesheetUncheckedUpdateInputObjectSchema]),
});
