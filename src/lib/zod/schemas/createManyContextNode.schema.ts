import { z } from 'zod';
import { ContextNodeCreateManyInputObjectSchema } from './objects/ContextNodeCreateManyInput.schema';

export const ContextNodeCreateManySchema = z.object({
	data: ContextNodeCreateManyInputObjectSchema,
});
