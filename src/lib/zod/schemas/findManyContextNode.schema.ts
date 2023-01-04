import { z } from 'zod';
import { ContextNodeOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/ContextNodeOrderByWithRelationAndSearchRelevanceInput.schema';
import { ContextNodeWhereInputObjectSchema } from './objects/ContextNodeWhereInput.schema';
import { ContextNodeWhereUniqueInputObjectSchema } from './objects/ContextNodeWhereUniqueInput.schema';
import { ContextNodeScalarFieldEnumSchema } from './enums/ContextNodeScalarFieldEnum.schema';

export const ContextNodeFindManySchema = z.object({
	orderBy: z
		.union([
			ContextNodeOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			ContextNodeOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: ContextNodeWhereInputObjectSchema.optional(),
	cursor: ContextNodeWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(ContextNodeScalarFieldEnumSchema).optional(),
});
