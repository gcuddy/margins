import { z } from 'zod';
import { SmartListWhereInputObjectSchema } from './objects/SmartListWhereInput.schema';

export const SmartListDeleteManySchema = z.object({
	where: SmartListWhereInputObjectSchema.optional(),
});
