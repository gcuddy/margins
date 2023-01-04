import { z } from 'zod';
import { EntryCreateManyInputObjectSchema } from './objects/EntryCreateManyInput.schema';

export const EntryCreateManySchema = z.object({ data: EntryCreateManyInputObjectSchema });
