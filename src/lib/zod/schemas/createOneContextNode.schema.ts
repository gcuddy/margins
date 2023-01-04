import { z } from 'zod';
import { ContextNodeCreateInputObjectSchema } from './objects/ContextNodeCreateInput.schema';
import { ContextNodeUncheckedCreateInputObjectSchema } from './objects/ContextNodeUncheckedCreateInput.schema';

export const ContextNodeCreateOneSchema = z.object({
	data: z.union([ContextNodeCreateInputObjectSchema, ContextNodeUncheckedCreateInputObjectSchema]),
});
