import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './objects/TaggingWhereUniqueInput.schema';

export const TaggingFindUniqueSchema = z.object({ where: TaggingWhereUniqueInputObjectSchema });
