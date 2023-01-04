import { z } from 'zod';
import { TaggingCreateInputObjectSchema } from './objects/TaggingCreateInput.schema';
import { TaggingUncheckedCreateInputObjectSchema } from './objects/TaggingUncheckedCreateInput.schema';

export const TaggingCreateOneSchema = z.object({
	data: z.union([TaggingCreateInputObjectSchema, TaggingUncheckedCreateInputObjectSchema]),
});
