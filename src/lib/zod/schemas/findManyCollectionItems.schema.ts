import { z } from 'zod';
import { CollectionItemsOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/CollectionItemsOrderByWithRelationAndSearchRelevanceInput.schema';
import { CollectionItemsWhereInputObjectSchema } from './objects/CollectionItemsWhereInput.schema';
import { CollectionItemsWhereUniqueInputObjectSchema } from './objects/CollectionItemsWhereUniqueInput.schema';
import { CollectionItemsScalarFieldEnumSchema } from './enums/CollectionItemsScalarFieldEnum.schema';

export const CollectionItemsFindManySchema = z.object({
	orderBy: z
		.union([
			CollectionItemsOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			CollectionItemsOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: CollectionItemsWhereInputObjectSchema.optional(),
	cursor: CollectionItemsWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(CollectionItemsScalarFieldEnumSchema).optional(),
});
