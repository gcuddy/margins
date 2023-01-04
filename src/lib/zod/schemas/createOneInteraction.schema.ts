import { z } from 'zod';
import { InteractionCreateInputObjectSchema } from './objects/InteractionCreateInput.schema';
import { InteractionUncheckedCreateInputObjectSchema } from './objects/InteractionUncheckedCreateInput.schema';

export const InteractionCreateOneSchema = z.object({
	data: z.union([InteractionCreateInputObjectSchema, InteractionUncheckedCreateInputObjectSchema]),
});
