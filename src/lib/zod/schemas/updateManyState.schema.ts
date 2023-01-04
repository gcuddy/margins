import { z } from 'zod';
import { StateUpdateManyMutationInputObjectSchema } from './objects/StateUpdateManyMutationInput.schema';
import { StateWhereInputObjectSchema } from './objects/StateWhereInput.schema';

export const StateUpdateManySchema = z.object({
	data: StateUpdateManyMutationInputObjectSchema,
	where: StateWhereInputObjectSchema.optional(),
});
