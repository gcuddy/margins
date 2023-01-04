import { z } from 'zod';
import { ContextNodeUpdateInputObjectSchema } from './objects/ContextNodeUpdateInput.schema';
import { ContextNodeUncheckedUpdateInputObjectSchema } from './objects/ContextNodeUncheckedUpdateInput.schema';
import { ContextNodeWhereUniqueInputObjectSchema } from './objects/ContextNodeWhereUniqueInput.schema';

export const ContextNodeUpdateOneSchema = z.object({
	data: z.union([ContextNodeUpdateInputObjectSchema, ContextNodeUncheckedUpdateInputObjectSchema]),
	where: ContextNodeWhereUniqueInputObjectSchema,
});
