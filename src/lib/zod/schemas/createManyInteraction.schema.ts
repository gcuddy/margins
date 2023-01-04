import { z } from 'zod';
import { InteractionCreateManyInputObjectSchema } from './objects/InteractionCreateManyInput.schema';

export const InteractionCreateManySchema = z.object({
	data: InteractionCreateManyInputObjectSchema,
});
