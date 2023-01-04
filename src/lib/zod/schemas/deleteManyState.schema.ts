import { z } from 'zod';
import { StateWhereInputObjectSchema } from './objects/StateWhereInput.schema';

export const StateDeleteManySchema = z.object({ where: StateWhereInputObjectSchema.optional() });
