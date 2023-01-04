import { z } from 'zod';
import { InteractionUpdateManyMutationInputObjectSchema } from './objects/InteractionUpdateManyMutationInput.schema';
import { InteractionWhereInputObjectSchema } from './objects/InteractionWhereInput.schema';

export const InteractionUpdateManySchema = z.object({
	data: InteractionUpdateManyMutationInputObjectSchema,
	where: InteractionWhereInputObjectSchema.optional(),
});
