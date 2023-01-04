import { z } from 'zod';
import { SmartListCreateManyInputObjectSchema } from './objects/SmartListCreateManyInput.schema';

export const SmartListCreateManySchema = z.object({ data: SmartListCreateManyInputObjectSchema });
