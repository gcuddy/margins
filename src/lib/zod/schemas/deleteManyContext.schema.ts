import { z } from 'zod';
import { ContextWhereInputObjectSchema } from './objects/ContextWhereInput.schema';

export const ContextDeleteManySchema = z.object({
	where: ContextWhereInputObjectSchema.optional(),
});
