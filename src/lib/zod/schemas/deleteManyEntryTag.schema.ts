import { z } from 'zod';
import { EntryTagWhereInputObjectSchema } from './objects/EntryTagWhereInput.schema';

export const EntryTagDeleteManySchema = z.object({
	where: EntryTagWhereInputObjectSchema.optional(),
});
