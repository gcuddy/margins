import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './objects/TaggingWhereUniqueInput.schema';
import { TaggingCreateInputObjectSchema } from './objects/TaggingCreateInput.schema';
import { TaggingUncheckedCreateInputObjectSchema } from './objects/TaggingUncheckedCreateInput.schema';
import { TaggingUpdateInputObjectSchema } from './objects/TaggingUpdateInput.schema';
import { TaggingUncheckedUpdateInputObjectSchema } from './objects/TaggingUncheckedUpdateInput.schema';

export const TaggingUpsertSchema = z.object({
	where: TaggingWhereUniqueInputObjectSchema,
	create: z.union([TaggingCreateInputObjectSchema, TaggingUncheckedCreateInputObjectSchema]),
	update: z.union([TaggingUpdateInputObjectSchema, TaggingUncheckedUpdateInputObjectSchema]),
});
