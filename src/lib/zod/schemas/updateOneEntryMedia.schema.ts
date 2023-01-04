import { z } from 'zod';
import { EntryMediaUpdateInputObjectSchema } from './objects/EntryMediaUpdateInput.schema';
import { EntryMediaUncheckedUpdateInputObjectSchema } from './objects/EntryMediaUncheckedUpdateInput.schema';
import { EntryMediaWhereUniqueInputObjectSchema } from './objects/EntryMediaWhereUniqueInput.schema';

export const EntryMediaUpdateOneSchema = z.object({
	data: z.union([EntryMediaUpdateInputObjectSchema, EntryMediaUncheckedUpdateInputObjectSchema]),
	where: EntryMediaWhereUniqueInputObjectSchema,
});
