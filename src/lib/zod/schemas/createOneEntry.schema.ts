import { z } from 'zod';
import { EntryCreateInputObjectSchema } from './objects/EntryCreateInput.schema';
import { EntryUncheckedCreateInputObjectSchema } from './objects/EntryUncheckedCreateInput.schema';

export const EntryCreateOneSchema = z.object({
	data: z.union([EntryCreateInputObjectSchema, EntryUncheckedCreateInputObjectSchema]),
});
