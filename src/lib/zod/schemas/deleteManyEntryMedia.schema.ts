import { z } from 'zod';
import { EntryMediaWhereInputObjectSchema } from './objects/EntryMediaWhereInput.schema';

export const EntryMediaDeleteManySchema = z.object({
	where: EntryMediaWhereInputObjectSchema.optional(),
});
