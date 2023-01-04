import { z } from 'zod';
import { EntryDataCreateManyInputObjectSchema } from './objects/EntryDataCreateManyInput.schema';

export const EntryDataCreateManySchema = z.object({ data: EntryDataCreateManyInputObjectSchema });
