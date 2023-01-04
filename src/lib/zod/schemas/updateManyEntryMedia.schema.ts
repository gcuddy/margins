import { z } from 'zod';
import { EntryMediaUpdateManyMutationInputObjectSchema } from './objects/EntryMediaUpdateManyMutationInput.schema';
import { EntryMediaWhereInputObjectSchema } from './objects/EntryMediaWhereInput.schema';

export const EntryMediaUpdateManySchema = z.object({
	data: EntryMediaUpdateManyMutationInputObjectSchema,
	where: EntryMediaWhereInputObjectSchema.optional(),
});
