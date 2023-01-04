import { z } from 'zod';
import { InteractionWhereInputObjectSchema } from './objects/InteractionWhereInput.schema';

export const InteractionDeleteManySchema = z.object({
	where: InteractionWhereInputObjectSchema.optional(),
});
