import { z } from 'zod';
import { TaggingUpdateManyMutationInputObjectSchema } from './objects/TaggingUpdateManyMutationInput.schema';
import { TaggingWhereInputObjectSchema } from './objects/TaggingWhereInput.schema';

export const TaggingUpdateManySchema = z.object({
	data: TaggingUpdateManyMutationInputObjectSchema,
	where: TaggingWhereInputObjectSchema.optional(),
});
