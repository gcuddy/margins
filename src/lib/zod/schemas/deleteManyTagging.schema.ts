import { z } from 'zod';
import { TaggingWhereInputObjectSchema } from './objects/TaggingWhereInput.schema';

export const TaggingDeleteManySchema = z.object({
	where: TaggingWhereInputObjectSchema.optional(),
});
