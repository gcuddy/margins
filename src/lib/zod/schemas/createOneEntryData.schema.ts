import { z } from 'zod';
import { EntryDataCreateInputObjectSchema } from './objects/EntryDataCreateInput.schema';
import { EntryDataUncheckedCreateInputObjectSchema } from './objects/EntryDataUncheckedCreateInput.schema';

export const EntryDataCreateOneSchema = z.object({
	data: z.union([EntryDataCreateInputObjectSchema, EntryDataUncheckedCreateInputObjectSchema]),
});
