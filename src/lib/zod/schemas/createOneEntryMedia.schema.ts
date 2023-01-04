import { z } from 'zod';
import { EntryMediaCreateInputObjectSchema } from './objects/EntryMediaCreateInput.schema';
import { EntryMediaUncheckedCreateInputObjectSchema } from './objects/EntryMediaUncheckedCreateInput.schema';

export const EntryMediaCreateOneSchema = z.object({
	data: z.union([EntryMediaCreateInputObjectSchema, EntryMediaUncheckedCreateInputObjectSchema]),
});
