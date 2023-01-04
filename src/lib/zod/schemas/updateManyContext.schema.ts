import { z } from 'zod';
import { ContextUpdateManyMutationInputObjectSchema } from './objects/ContextUpdateManyMutationInput.schema';
import { ContextWhereInputObjectSchema } from './objects/ContextWhereInput.schema';

export const ContextUpdateManySchema = z.object({
	data: ContextUpdateManyMutationInputObjectSchema,
	where: ContextWhereInputObjectSchema.optional(),
});
