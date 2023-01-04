import { z } from 'zod';
import { StylesheetWhereUniqueInputObjectSchema } from './objects/StylesheetWhereUniqueInput.schema';

export const StylesheetFindUniqueSchema = z.object({
	where: StylesheetWhereUniqueInputObjectSchema,
});
