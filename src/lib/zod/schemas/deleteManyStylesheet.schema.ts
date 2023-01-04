import { z } from 'zod';
import { StylesheetWhereInputObjectSchema } from './objects/StylesheetWhereInput.schema';

export const StylesheetDeleteManySchema = z.object({
	where: StylesheetWhereInputObjectSchema.optional(),
});
