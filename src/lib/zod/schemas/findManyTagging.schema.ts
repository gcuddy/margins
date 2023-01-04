import { z } from 'zod';
import { TaggingOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/TaggingOrderByWithRelationAndSearchRelevanceInput.schema';
import { TaggingWhereInputObjectSchema } from './objects/TaggingWhereInput.schema';
import { TaggingWhereUniqueInputObjectSchema } from './objects/TaggingWhereUniqueInput.schema';
import { TaggingScalarFieldEnumSchema } from './enums/TaggingScalarFieldEnum.schema';

export const TaggingFindManySchema = z.object({
	orderBy: z
		.union([
			TaggingOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			TaggingOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: TaggingWhereInputObjectSchema.optional(),
	cursor: TaggingWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(TaggingScalarFieldEnumSchema).optional(),
});
