import { z } from 'zod';
import { UserOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/UserOrderByWithRelationAndSearchRelevanceInput.schema';
import { UserWhereInputObjectSchema } from './objects/UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema } from './objects/UserWhereUniqueInput.schema';
import { UserScalarFieldEnumSchema } from './enums/UserScalarFieldEnum.schema';

export const UserFindFirstSchema = z.object({
	orderBy: z
		.union([
			UserOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			UserOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: UserWhereInputObjectSchema.optional(),
	cursor: UserWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(UserScalarFieldEnumSchema).optional(),
});
