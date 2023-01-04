import { z } from 'zod';
import { SmartListOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/SmartListOrderByWithRelationAndSearchRelevanceInput.schema';
import { SmartListWhereInputObjectSchema } from './objects/SmartListWhereInput.schema';
import { SmartListWhereUniqueInputObjectSchema } from './objects/SmartListWhereUniqueInput.schema';
import { SmartListScalarFieldEnumSchema } from './enums/SmartListScalarFieldEnum.schema';

export const SmartListFindFirstSchema = z.object({
	orderBy: z
		.union([
			SmartListOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			SmartListOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: SmartListWhereInputObjectSchema.optional(),
	cursor: SmartListWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(SmartListScalarFieldEnumSchema).optional(),
});
