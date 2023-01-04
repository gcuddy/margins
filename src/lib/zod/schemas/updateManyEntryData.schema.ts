import { z } from 'zod';
import { EntryDataUpdateManyMutationInputObjectSchema } from './objects/EntryDataUpdateManyMutationInput.schema';
import { EntryDataWhereInputObjectSchema } from './objects/EntryDataWhereInput.schema';

export const EntryDataUpdateManySchema = z.object({
	data: EntryDataUpdateManyMutationInputObjectSchema,
	where: EntryDataWhereInputObjectSchema.optional(),
});
