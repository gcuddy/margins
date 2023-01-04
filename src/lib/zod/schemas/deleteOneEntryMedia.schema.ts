import { z } from 'zod';
import { EntryMediaWhereUniqueInputObjectSchema } from './objects/EntryMediaWhereUniqueInput.schema';

export const EntryMediaDeleteOneSchema = z.object({
	where: EntryMediaWhereUniqueInputObjectSchema,
});
