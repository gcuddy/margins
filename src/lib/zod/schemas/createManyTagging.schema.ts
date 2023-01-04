import { z } from 'zod';
import { TaggingCreateManyInputObjectSchema } from './objects/TaggingCreateManyInput.schema';

export const TaggingCreateManySchema = z.object({ data: TaggingCreateManyInputObjectSchema });
