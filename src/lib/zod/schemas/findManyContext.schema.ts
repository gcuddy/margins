import { z } from 'zod';
import { ContextOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/ContextOrderByWithRelationAndSearchRelevanceInput.schema';
import { ContextWhereInputObjectSchema } from './objects/ContextWhereInput.schema';
import { ContextWhereUniqueInputObjectSchema } from './objects/ContextWhereUniqueInput.schema';
import { ContextScalarFieldEnumSchema } from './enums/ContextScalarFieldEnum.schema';

export const ContextFindManySchema = z.object({
	orderBy: z
		.union([
			ContextOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			ContextOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: ContextWhereInputObjectSchema.optional(),
	cursor: ContextWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(ContextScalarFieldEnumSchema).optional(),
});
