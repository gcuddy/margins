import { z } from 'zod';
import { StylesheetCreateManyInputObjectSchema } from './objects/StylesheetCreateManyInput.schema';

export const StylesheetCreateManySchema = z.object({ data: StylesheetCreateManyInputObjectSchema });
