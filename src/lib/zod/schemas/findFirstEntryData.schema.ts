import { z } from 'zod';
import { EntryDataOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/EntryDataOrderByWithRelationAndSearchRelevanceInput.schema';
import { EntryDataWhereInputObjectSchema } from './objects/EntryDataWhereInput.schema';
import { EntryDataWhereUniqueInputObjectSchema } from './objects/EntryDataWhereUniqueInput.schema';
import { EntryDataScalarFieldEnumSchema } from './enums/EntryDataScalarFieldEnum.schema';

export const EntryDataFindFirstSchema = z.object({
	orderBy: z
		.union([
			EntryDataOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			EntryDataOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: EntryDataWhereInputObjectSchema.optional(),
	cursor: EntryDataWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(EntryDataScalarFieldEnumSchema).optional(),
});
