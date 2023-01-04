import { z } from 'zod';
import { EntryWhereUniqueInputObjectSchema } from './objects/EntryWhereUniqueInput.schema';
import { EntryCreateInputObjectSchema } from './objects/EntryCreateInput.schema';
import { EntryUncheckedCreateInputObjectSchema } from './objects/EntryUncheckedCreateInput.schema';
import { EntryUpdateInputObjectSchema } from './objects/EntryUpdateInput.schema';
import { EntryUncheckedUpdateInputObjectSchema } from './objects/EntryUncheckedUpdateInput.schema';

export const EntryUpsertSchema = z.object({
	where: EntryWhereUniqueInputObjectSchema,
	create: z.union([EntryCreateInputObjectSchema, EntryUncheckedCreateInputObjectSchema]),
	update: z.union([EntryUpdateInputObjectSchema, EntryUncheckedUpdateInputObjectSchema]),
});
