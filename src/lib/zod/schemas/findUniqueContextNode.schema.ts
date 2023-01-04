import { z } from 'zod';
import { ContextNodeWhereUniqueInputObjectSchema } from './objects/ContextNodeWhereUniqueInput.schema';

export const ContextNodeFindUniqueSchema = z.object({
	where: ContextNodeWhereUniqueInputObjectSchema,
});
