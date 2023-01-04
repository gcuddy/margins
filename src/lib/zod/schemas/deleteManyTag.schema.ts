import { z } from 'zod';
import { TagWhereInputObjectSchema } from './objects/TagWhereInput.schema';

export const TagDeleteManySchema = z.object({ where: TagWhereInputObjectSchema.optional() });
