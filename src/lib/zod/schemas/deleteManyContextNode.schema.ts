import { z } from 'zod';
import { ContextNodeWhereInputObjectSchema } from './objects/ContextNodeWhereInput.schema';

export const ContextNodeDeleteManySchema = z.object({
	where: ContextNodeWhereInputObjectSchema.optional(),
});
