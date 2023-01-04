import { z } from 'zod';
import { ContextUpdateInputObjectSchema } from './objects/ContextUpdateInput.schema';
import { ContextUncheckedUpdateInputObjectSchema } from './objects/ContextUncheckedUpdateInput.schema';
import { ContextWhereUniqueInputObjectSchema } from './objects/ContextWhereUniqueInput.schema';

export const ContextUpdateOneSchema = z.object({
	data: z.union([ContextUpdateInputObjectSchema, ContextUncheckedUpdateInputObjectSchema]),
	where: ContextWhereUniqueInputObjectSchema,
});
