import { z } from 'zod';
import { TagCreateManyInputObjectSchema } from './objects/TagCreateManyInput.schema';

export const TagCreateManySchema = z.object({ data: TagCreateManyInputObjectSchema });
