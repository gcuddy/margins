import { z } from 'zod';
import { ContextNodeUpdateManyMutationInputObjectSchema } from './objects/ContextNodeUpdateManyMutationInput.schema';
import { ContextNodeWhereInputObjectSchema } from './objects/ContextNodeWhereInput.schema';

export const ContextNodeUpdateManySchema = z.object({
	data: ContextNodeUpdateManyMutationInputObjectSchema,
	where: ContextNodeWhereInputObjectSchema.optional(),
});
