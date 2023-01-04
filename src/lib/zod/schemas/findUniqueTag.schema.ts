import { z } from 'zod';
import { TagWhereUniqueInputObjectSchema } from './objects/TagWhereUniqueInput.schema';

export const TagFindUniqueSchema = z.object({ where: TagWhereUniqueInputObjectSchema });
