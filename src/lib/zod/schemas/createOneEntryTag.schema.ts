import { z } from 'zod';
import { EntryTagCreateInputObjectSchema } from './objects/EntryTagCreateInput.schema';
import { EntryTagUncheckedCreateInputObjectSchema } from './objects/EntryTagUncheckedCreateInput.schema';

export const EntryTagCreateOneSchema = z.object({
	data: z.union([EntryTagCreateInputObjectSchema, EntryTagUncheckedCreateInputObjectSchema]),
});
