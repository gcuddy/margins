import { z } from 'zod';
import { ContextCreateManyInputObjectSchema } from './objects/ContextCreateManyInput.schema';

export const ContextCreateManySchema = z.object({ data: ContextCreateManyInputObjectSchema });
