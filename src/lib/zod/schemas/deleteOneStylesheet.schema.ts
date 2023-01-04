import { z } from 'zod';
import { StylesheetWhereUniqueInputObjectSchema } from './objects/StylesheetWhereUniqueInput.schema';

export const StylesheetDeleteOneSchema = z.object({
	where: StylesheetWhereUniqueInputObjectSchema,
});
