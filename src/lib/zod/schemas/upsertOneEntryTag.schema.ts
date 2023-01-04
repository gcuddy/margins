import { z } from 'zod';
import { EntryTagWhereUniqueInputObjectSchema } from './objects/EntryTagWhereUniqueInput.schema';
import { EntryTagCreateInputObjectSchema } from './objects/EntryTagCreateInput.schema';
import { EntryTagUncheckedCreateInputObjectSchema } from './objects/EntryTagUncheckedCreateInput.schema';
import { EntryTagUpdateInputObjectSchema } from './objects/EntryTagUpdateInput.schema';
import { EntryTagUncheckedUpdateInputObjectSchema } from './objects/EntryTagUncheckedUpdateInput.schema';

export const EntryTagUpsertSchema = z.object({
	where: EntryTagWhereUniqueInputObjectSchema,
	create: z.union([EntryTagCreateInputObjectSchema, EntryTagUncheckedCreateInputObjectSchema]),
	update: z.union([EntryTagUpdateInputObjectSchema, EntryTagUncheckedUpdateInputObjectSchema]),
});
