import { z } from 'zod';
import { InteractionWhereUniqueInputObjectSchema } from './objects/InteractionWhereUniqueInput.schema';

export const InteractionDeleteOneSchema = z.object({
	where: InteractionWhereUniqueInputObjectSchema,
});
