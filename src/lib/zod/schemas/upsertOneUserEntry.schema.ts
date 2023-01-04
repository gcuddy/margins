import { z } from 'zod';
import { UserEntryWhereUniqueInputObjectSchema } from './objects/UserEntryWhereUniqueInput.schema';
import { UserEntryCreateInputObjectSchema } from './objects/UserEntryCreateInput.schema';
import { UserEntryUncheckedCreateInputObjectSchema } from './objects/UserEntryUncheckedCreateInput.schema';
import { UserEntryUpdateInputObjectSchema } from './objects/UserEntryUpdateInput.schema';
import { UserEntryUncheckedUpdateInputObjectSchema } from './objects/UserEntryUncheckedUpdateInput.schema';

export const UserEntryUpsertSchema = z.object({
	where: UserEntryWhereUniqueInputObjectSchema,
	create: z.union([UserEntryCreateInputObjectSchema, UserEntryUncheckedCreateInputObjectSchema]),
	update: z.union([UserEntryUpdateInputObjectSchema, UserEntryUncheckedUpdateInputObjectSchema]),
});
