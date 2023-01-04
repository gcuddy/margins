import { z } from 'zod';
import { EntryDataWhereInputObjectSchema } from './objects/EntryDataWhereInput.schema';

export const EntryDataDeleteManySchema = z.object({
	where: EntryDataWhereInputObjectSchema.optional(),
});
