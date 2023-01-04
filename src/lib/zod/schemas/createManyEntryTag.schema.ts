import { z } from 'zod';
import { EntryTagCreateManyInputObjectSchema } from './objects/EntryTagCreateManyInput.schema';

export const EntryTagCreateManySchema = z.object({ data: EntryTagCreateManyInputObjectSchema });
