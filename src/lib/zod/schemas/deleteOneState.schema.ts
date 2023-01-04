import { z } from 'zod';
import { StateWhereUniqueInputObjectSchema } from './objects/StateWhereUniqueInput.schema';

export const StateDeleteOneSchema = z.object({ where: StateWhereUniqueInputObjectSchema });
