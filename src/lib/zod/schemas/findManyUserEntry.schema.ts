import { z } from 'zod';
import { UserEntryOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/UserEntryOrderByWithRelationAndSearchRelevanceInput.schema';
import { UserEntryWhereInputObjectSchema } from './objects/UserEntryWhereInput.schema';
import { UserEntryWhereUniqueInputObjectSchema } from './objects/UserEntryWhereUniqueInput.schema';
import { UserEntryScalarFieldEnumSchema } from './enums/UserEntryScalarFieldEnum.schema';

export const UserEntryFindManySchema = z.object({
	orderBy: z
		.union([
			UserEntryOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			UserEntryOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: UserEntryWhereInputObjectSchema.optional(),
	cursor: UserEntryWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(UserEntryScalarFieldEnumSchema).optional(),
});
