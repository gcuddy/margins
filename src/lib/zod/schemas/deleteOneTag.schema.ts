import { z } from 'zod';
import { TagWhereUniqueInputObjectSchema } from './objects/TagWhereUniqueInput.schema';

export const TagDeleteOneSchema = z.object({ where: TagWhereUniqueInputObjectSchema });
