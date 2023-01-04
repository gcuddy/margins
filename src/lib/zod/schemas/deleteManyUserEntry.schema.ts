import { z } from 'zod';
import { UserEntryWhereInputObjectSchema } from './objects/UserEntryWhereInput.schema';

export const UserEntryDeleteManySchema = z.object({
	where: UserEntryWhereInputObjectSchema.optional(),
});
