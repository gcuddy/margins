import { z } from 'zod';
import { InteractionOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/InteractionOrderByWithRelationAndSearchRelevanceInput.schema';
import { InteractionWhereInputObjectSchema } from './objects/InteractionWhereInput.schema';
import { InteractionWhereUniqueInputObjectSchema } from './objects/InteractionWhereUniqueInput.schema';
import { InteractionScalarFieldEnumSchema } from './enums/InteractionScalarFieldEnum.schema';

export const InteractionFindManySchema = z.object({
	orderBy: z
		.union([
			InteractionOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			InteractionOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: InteractionWhereInputObjectSchema.optional(),
	cursor: InteractionWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(InteractionScalarFieldEnumSchema).optional(),
});
