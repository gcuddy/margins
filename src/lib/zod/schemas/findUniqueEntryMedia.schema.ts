import { z } from 'zod';
import { EntryMediaWhereUniqueInputObjectSchema } from './objects/EntryMediaWhereUniqueInput.schema';

export const EntryMediaFindUniqueSchema = z.object({
	where: EntryMediaWhereUniqueInputObjectSchema,
});
