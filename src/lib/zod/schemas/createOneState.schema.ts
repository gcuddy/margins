import { z } from 'zod';
import { StateCreateInputObjectSchema } from './objects/StateCreateInput.schema';
import { StateUncheckedCreateInputObjectSchema } from './objects/StateUncheckedCreateInput.schema';

export const StateCreateOneSchema = z.object({
	data: z.union([StateCreateInputObjectSchema, StateUncheckedCreateInputObjectSchema]),
});
