import { z } from 'zod';
import { InteractionWhereUniqueInputObjectSchema } from './objects/InteractionWhereUniqueInput.schema';

export const InteractionFindUniqueSchema = z.object({
	where: InteractionWhereUniqueInputObjectSchema,
});
