import { z } from 'zod';
import { EntryDataUpdateInputObjectSchema } from './objects/EntryDataUpdateInput.schema';
import { EntryDataUncheckedUpdateInputObjectSchema } from './objects/EntryDataUncheckedUpdateInput.schema';
import { EntryDataWhereUniqueInputObjectSchema } from './objects/EntryDataWhereUniqueInput.schema';

export const EntryDataUpdateOneSchema = z.object({
	data: z.union([EntryDataUpdateInputObjectSchema, EntryDataUncheckedUpdateInputObjectSchema]),
	where: EntryDataWhereUniqueInputObjectSchema,
});
