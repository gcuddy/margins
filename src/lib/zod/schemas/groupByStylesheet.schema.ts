import { z } from 'zod';
import { StylesheetWhereInputObjectSchema } from './objects/StylesheetWhereInput.schema';
import { StylesheetOrderByWithAggregationInputObjectSchema } from './objects/StylesheetOrderByWithAggregationInput.schema';
import { StylesheetScalarWhereWithAggregatesInputObjectSchema } from './objects/StylesheetScalarWhereWithAggregatesInput.schema';
import { StylesheetScalarFieldEnumSchema } from './enums/StylesheetScalarFieldEnum.schema';

export const StylesheetGroupBySchema = z.object({
	where: StylesheetWhereInputObjectSchema.optional(),
	orderBy: z.union([
		StylesheetOrderByWithAggregationInputObjectSchema,
		StylesheetOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: StylesheetScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(StylesheetScalarFieldEnumSchema),
});
