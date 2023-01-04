import { z } from 'zod';
import { StateUpdateInputObjectSchema } from './objects/StateUpdateInput.schema';
import { StateUncheckedUpdateInputObjectSchema } from './objects/StateUncheckedUpdateInput.schema';
import { StateWhereUniqueInputObjectSchema } from './objects/StateWhereUniqueInput.schema';

export const StateUpdateOneSchema = z.object({
	data: z.union([StateUpdateInputObjectSchema, StateUncheckedUpdateInputObjectSchema]),
	where: StateWhereUniqueInputObjectSchema,
});
