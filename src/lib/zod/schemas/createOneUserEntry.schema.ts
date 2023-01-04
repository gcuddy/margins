import { z } from 'zod';
import { UserEntryCreateInputObjectSchema } from './objects/UserEntryCreateInput.schema';
import { UserEntryUncheckedCreateInputObjectSchema } from './objects/UserEntryUncheckedCreateInput.schema';

export const UserEntryCreateOneSchema = z.object({
	data: z.union([UserEntryCreateInputObjectSchema, UserEntryUncheckedCreateInputObjectSchema]),
});
