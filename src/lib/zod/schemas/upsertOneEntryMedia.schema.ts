import { z } from 'zod';
import { EntryMediaWhereUniqueInputObjectSchema } from './objects/EntryMediaWhereUniqueInput.schema';
import { EntryMediaCreateInputObjectSchema } from './objects/EntryMediaCreateInput.schema';
import { EntryMediaUncheckedCreateInputObjectSchema } from './objects/EntryMediaUncheckedCreateInput.schema';
import { EntryMediaUpdateInputObjectSchema } from './objects/EntryMediaUpdateInput.schema';
import { EntryMediaUncheckedUpdateInputObjectSchema } from './objects/EntryMediaUncheckedUpdateInput.schema';

export const EntryMediaUpsertSchema = z.object({
	where: EntryMediaWhereUniqueInputObjectSchema,
	create: z.union([EntryMediaCreateInputObjectSchema, EntryMediaUncheckedCreateInputObjectSchema]),
	update: z.union([EntryMediaUpdateInputObjectSchema, EntryMediaUncheckedUpdateInputObjectSchema]),
});
