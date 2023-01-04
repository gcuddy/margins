import { z } from 'zod';
import { ContextCreateInputObjectSchema } from './objects/ContextCreateInput.schema';
import { ContextUncheckedCreateInputObjectSchema } from './objects/ContextUncheckedCreateInput.schema';

export const ContextCreateOneSchema = z.object({
	data: z.union([ContextCreateInputObjectSchema, ContextUncheckedCreateInputObjectSchema]),
});
