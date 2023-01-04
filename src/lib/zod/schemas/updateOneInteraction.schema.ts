import { z } from 'zod';
import { InteractionUpdateInputObjectSchema } from './objects/InteractionUpdateInput.schema';
import { InteractionUncheckedUpdateInputObjectSchema } from './objects/InteractionUncheckedUpdateInput.schema';
import { InteractionWhereUniqueInputObjectSchema } from './objects/InteractionWhereUniqueInput.schema';

export const InteractionUpdateOneSchema = z.object({
	data: z.union([InteractionUpdateInputObjectSchema, InteractionUncheckedUpdateInputObjectSchema]),
	where: InteractionWhereUniqueInputObjectSchema,
});
