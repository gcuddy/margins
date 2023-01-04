import { z } from 'zod';
import { CollectionOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/CollectionOrderByWithRelationAndSearchRelevanceInput.schema';
import { CollectionWhereInputObjectSchema } from './objects/CollectionWhereInput.schema';
import { CollectionWhereUniqueInputObjectSchema } from './objects/CollectionWhereUniqueInput.schema';
import { CollectionScalarFieldEnumSchema } from './enums/CollectionScalarFieldEnum.schema';

export const CollectionFindFirstSchema = z.object({
	orderBy: z
		.union([
			CollectionOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			CollectionOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: CollectionWhereInputObjectSchema.optional(),
	cursor: CollectionWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(CollectionScalarFieldEnumSchema).optional(),
});
