import { z } from 'zod';
import { EntryTagUpdateManyMutationInputObjectSchema } from './objects/EntryTagUpdateManyMutationInput.schema';
import { EntryTagWhereInputObjectSchema } from './objects/EntryTagWhereInput.schema';

export const EntryTagUpdateManySchema = z.object({
	data: EntryTagUpdateManyMutationInputObjectSchema,
	where: EntryTagWhereInputObjectSchema.optional(),
});
