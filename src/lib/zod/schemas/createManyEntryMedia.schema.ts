import { z } from 'zod';
import { EntryMediaCreateManyInputObjectSchema } from './objects/EntryMediaCreateManyInput.schema';

export const EntryMediaCreateManySchema = z.object({ data: EntryMediaCreateManyInputObjectSchema });
