import { z } from 'zod';
import { UserEntryUpdateInputObjectSchema } from './objects/UserEntryUpdateInput.schema';
import { UserEntryUncheckedUpdateInputObjectSchema } from './objects/UserEntryUncheckedUpdateInput.schema';
import { UserEntryWhereUniqueInputObjectSchema } from './objects/UserEntryWhereUniqueInput.schema';

export const UserEntryUpdateOneSchema = z.object({
	data: z.union([UserEntryUpdateInputObjectSchema, UserEntryUncheckedUpdateInputObjectSchema]),
	where: UserEntryWhereUniqueInputObjectSchema,
});
