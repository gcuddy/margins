import { z } from 'zod';
import { EntryDataWhereUniqueInputObjectSchema } from './objects/EntryDataWhereUniqueInput.schema';
import { EntryDataCreateInputObjectSchema } from './objects/EntryDataCreateInput.schema';
import { EntryDataUncheckedCreateInputObjectSchema } from './objects/EntryDataUncheckedCreateInput.schema';
import { EntryDataUpdateInputObjectSchema } from './objects/EntryDataUpdateInput.schema';
import { EntryDataUncheckedUpdateInputObjectSchema } from './objects/EntryDataUncheckedUpdateInput.schema';

export const EntryDataUpsertSchema = z.object({
	where: EntryDataWhereUniqueInputObjectSchema,
	create: z.union([EntryDataCreateInputObjectSchema, EntryDataUncheckedCreateInputObjectSchema]),
	update: z.union([EntryDataUpdateInputObjectSchema, EntryDataUncheckedUpdateInputObjectSchema]),
});
