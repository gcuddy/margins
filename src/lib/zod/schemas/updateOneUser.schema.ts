import { z } from 'zod';
import { UserUpdateInputObjectSchema } from './objects/UserUpdateInput.schema';
import { UserUncheckedUpdateInputObjectSchema } from './objects/UserUncheckedUpdateInput.schema';
import { UserWhereUniqueInputObjectSchema } from './objects/UserWhereUniqueInput.schema';

export const UserUpdateOneSchema = z.object({
	data: z.union([UserUpdateInputObjectSchema, UserUncheckedUpdateInputObjectSchema]),
	where: UserWhereUniqueInputObjectSchema,
});
