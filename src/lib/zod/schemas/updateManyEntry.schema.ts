import { z } from 'zod';
import { EntryUpdateManyMutationInputObjectSchema } from './objects/EntryUpdateManyMutationInput.schema';
import { EntryWhereInputObjectSchema } from './objects/EntryWhereInput.schema';

export const EntryUpdateManySchema = z.object({
	data: EntryUpdateManyMutationInputObjectSchema,
	where: EntryWhereInputObjectSchema.optional(),
});
