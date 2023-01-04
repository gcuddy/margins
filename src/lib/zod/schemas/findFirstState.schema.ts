import { z } from 'zod';
import { StateOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/StateOrderByWithRelationAndSearchRelevanceInput.schema';
import { StateWhereInputObjectSchema } from './objects/StateWhereInput.schema';
import { StateWhereUniqueInputObjectSchema } from './objects/StateWhereUniqueInput.schema';
import { StateScalarFieldEnumSchema } from './enums/StateScalarFieldEnum.schema';

export const StateFindFirstSchema = z.object({
	orderBy: z
		.union([
			StateOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			StateOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: StateWhereInputObjectSchema.optional(),
	cursor: StateWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(StateScalarFieldEnumSchema).optional(),
});
