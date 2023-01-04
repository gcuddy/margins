import { z } from 'zod';
import { StylesheetOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/StylesheetOrderByWithRelationAndSearchRelevanceInput.schema';
import { StylesheetWhereInputObjectSchema } from './objects/StylesheetWhereInput.schema';
import { StylesheetWhereUniqueInputObjectSchema } from './objects/StylesheetWhereUniqueInput.schema';
import { StylesheetScalarFieldEnumSchema } from './enums/StylesheetScalarFieldEnum.schema';

export const StylesheetFindFirstSchema = z.object({
	orderBy: z
		.union([
			StylesheetOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			StylesheetOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: StylesheetWhereInputObjectSchema.optional(),
	cursor: StylesheetWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(StylesheetScalarFieldEnumSchema).optional(),
});
