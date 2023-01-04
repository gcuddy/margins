import { z } from 'zod';
import { StateCreateManyInputObjectSchema } from './objects/StateCreateManyInput.schema';

export const StateCreateManySchema = z.object({ data: StateCreateManyInputObjectSchema });
