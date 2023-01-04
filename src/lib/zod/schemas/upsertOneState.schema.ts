import { z } from 'zod';
import { StateWhereUniqueInputObjectSchema } from './objects/StateWhereUniqueInput.schema';
import { StateCreateInputObjectSchema } from './objects/StateCreateInput.schema';
import { StateUncheckedCreateInputObjectSchema } from './objects/StateUncheckedCreateInput.schema';
import { StateUpdateInputObjectSchema } from './objects/StateUpdateInput.schema';
import { StateUncheckedUpdateInputObjectSchema } from './objects/StateUncheckedUpdateInput.schema';

export const StateUpsertSchema = z.object({
	where: StateWhereUniqueInputObjectSchema,
	create: z.union([StateCreateInputObjectSchema, StateUncheckedCreateInputObjectSchema]),
	update: z.union([StateUpdateInputObjectSchema, StateUncheckedUpdateInputObjectSchema]),
});
