import { z } from 'zod';
import { EntryMediaOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/EntryMediaOrderByWithRelationAndSearchRelevanceInput.schema';
import { EntryMediaWhereInputObjectSchema } from './objects/EntryMediaWhereInput.schema';
import { EntryMediaWhereUniqueInputObjectSchema } from './objects/EntryMediaWhereUniqueInput.schema';
import { EntryMediaScalarFieldEnumSchema } from './enums/EntryMediaScalarFieldEnum.schema';

export const EntryMediaFindManySchema = z.object({
	orderBy: z
		.union([
			EntryMediaOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			EntryMediaOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: EntryMediaWhereInputObjectSchema.optional(),
	cursor: EntryMediaWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(EntryMediaScalarFieldEnumSchema).optional(),
});
