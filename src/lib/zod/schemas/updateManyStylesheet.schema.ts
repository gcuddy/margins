import { z } from 'zod';
import { StylesheetUpdateManyMutationInputObjectSchema } from './objects/StylesheetUpdateManyMutationInput.schema';
import { StylesheetWhereInputObjectSchema } from './objects/StylesheetWhereInput.schema';

export const StylesheetUpdateManySchema = z.object({
	data: StylesheetUpdateManyMutationInputObjectSchema,
	where: StylesheetWhereInputObjectSchema.optional(),
});
