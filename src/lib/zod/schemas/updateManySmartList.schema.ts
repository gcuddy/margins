import { z } from 'zod';
import { SmartListUpdateManyMutationInputObjectSchema } from './objects/SmartListUpdateManyMutationInput.schema';
import { SmartListWhereInputObjectSchema } from './objects/SmartListWhereInput.schema';

export const SmartListUpdateManySchema = z.object({
	data: SmartListUpdateManyMutationInputObjectSchema,
	where: SmartListWhereInputObjectSchema.optional(),
});
