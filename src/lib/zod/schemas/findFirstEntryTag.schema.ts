import { z } from 'zod';
import { EntryTagOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/EntryTagOrderByWithRelationAndSearchRelevanceInput.schema';
import { EntryTagWhereInputObjectSchema } from './objects/EntryTagWhereInput.schema';
import { EntryTagWhereUniqueInputObjectSchema } from './objects/EntryTagWhereUniqueInput.schema';
import { EntryTagScalarFieldEnumSchema } from './enums/EntryTagScalarFieldEnum.schema';

export const EntryTagFindFirstSchema = z.object({
	orderBy: z
		.union([
			EntryTagOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			EntryTagOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: EntryTagWhereInputObjectSchema.optional(),
	cursor: EntryTagWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(EntryTagScalarFieldEnumSchema).optional(),
});
