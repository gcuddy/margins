import { z } from 'zod';
import { EntryUpdateInputObjectSchema } from './objects/EntryUpdateInput.schema';
import { EntryUncheckedUpdateInputObjectSchema } from './objects/EntryUncheckedUpdateInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './objects/EntryWhereUniqueInput.schema';

export const EntryUpdateOneSchema = z.object({
	data: z.union([EntryUpdateInputObjectSchema, EntryUncheckedUpdateInputObjectSchema]),
	where: EntryWhereUniqueInputObjectSchema,
});
