import { z } from 'zod';
import { TaggingUpdateInputObjectSchema } from './objects/TaggingUpdateInput.schema';
import { TaggingUncheckedUpdateInputObjectSchema } from './objects/TaggingUncheckedUpdateInput.schema';
import { TaggingWhereUniqueInputObjectSchema } from './objects/TaggingWhereUniqueInput.schema';

export const TaggingUpdateOneSchema = z.object({
	data: z.union([TaggingUpdateInputObjectSchema, TaggingUncheckedUpdateInputObjectSchema]),
	where: TaggingWhereUniqueInputObjectSchema,
});
