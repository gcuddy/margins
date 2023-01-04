import { z } from 'zod';
import { EntryTagUpdateInputObjectSchema } from './objects/EntryTagUpdateInput.schema';
import { EntryTagUncheckedUpdateInputObjectSchema } from './objects/EntryTagUncheckedUpdateInput.schema';
import { EntryTagWhereUniqueInputObjectSchema } from './objects/EntryTagWhereUniqueInput.schema';

export const EntryTagUpdateOneSchema = z.object({
	data: z.union([EntryTagUpdateInputObjectSchema, EntryTagUncheckedUpdateInputObjectSchema]),
	where: EntryTagWhereUniqueInputObjectSchema,
});
