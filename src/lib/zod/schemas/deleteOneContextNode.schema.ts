import { z } from 'zod';
import { ContextNodeWhereUniqueInputObjectSchema } from './objects/ContextNodeWhereUniqueInput.schema';

export const ContextNodeDeleteOneSchema = z.object({
	where: ContextNodeWhereUniqueInputObjectSchema,
});
