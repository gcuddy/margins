import { z } from 'zod';
import { TagUpdateInputObjectSchema } from './objects/TagUpdateInput.schema';
import { TagUncheckedUpdateInputObjectSchema } from './objects/TagUncheckedUpdateInput.schema';
import { TagWhereUniqueInputObjectSchema } from './objects/TagWhereUniqueInput.schema';

export const TagUpdateOneSchema = z.object({
	data: z.union([TagUpdateInputObjectSchema, TagUncheckedUpdateInputObjectSchema]),
	where: TagWhereUniqueInputObjectSchema,
});
