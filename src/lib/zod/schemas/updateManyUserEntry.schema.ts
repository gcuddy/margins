import { z } from 'zod';
import { UserEntryUpdateManyMutationInputObjectSchema } from './objects/UserEntryUpdateManyMutationInput.schema';
import { UserEntryWhereInputObjectSchema } from './objects/UserEntryWhereInput.schema';

export const UserEntryUpdateManySchema = z.object({
	data: UserEntryUpdateManyMutationInputObjectSchema,
	where: UserEntryWhereInputObjectSchema.optional(),
});
