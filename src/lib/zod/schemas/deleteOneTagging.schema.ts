import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './objects/TaggingWhereUniqueInput.schema';

export const TaggingDeleteOneSchema = z.object({ where: TaggingWhereUniqueInputObjectSchema });
