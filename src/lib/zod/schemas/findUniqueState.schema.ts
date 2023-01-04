import { z } from 'zod';
import { StateWhereUniqueInputObjectSchema } from './objects/StateWhereUniqueInput.schema';

export const StateFindUniqueSchema = z.object({ where: StateWhereUniqueInputObjectSchema });
