import { z } from 'zod';
import { TagCreateInputObjectSchema } from './objects/TagCreateInput.schema';
import { TagUncheckedCreateInputObjectSchema } from './objects/TagUncheckedCreateInput.schema';

export const TagCreateOneSchema = z.object({
	data: z.union([TagCreateInputObjectSchema, TagUncheckedCreateInputObjectSchema]),
});
