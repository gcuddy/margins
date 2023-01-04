import { z } from 'zod';
import { EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/EntryOrderByWithRelationAndSearchRelevanceInput.schema';
import { EntryWhereInputObjectSchema } from './objects/EntryWhereInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './objects/EntryWhereUniqueInput.schema';
import { EntryScalarFieldEnumSchema } from './enums/EntryScalarFieldEnum.schema';

export const EntryFindFirstSchema = z.object({
	orderBy: z
		.union([
			EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: EntryWhereInputObjectSchema.optional(),
	cursor: EntryWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(EntryScalarFieldEnumSchema).optional(),
});
