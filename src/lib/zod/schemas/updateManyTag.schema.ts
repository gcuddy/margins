import { z } from 'zod';
import { TagUpdateManyMutationInputObjectSchema } from './objects/TagUpdateManyMutationInput.schema';
import { TagWhereInputObjectSchema } from './objects/TagWhereInput.schema';

export const TagUpdateManySchema = z.object({
	data: TagUpdateManyMutationInputObjectSchema,
	where: TagWhereInputObjectSchema.optional(),
});
