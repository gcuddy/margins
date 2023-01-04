import { z } from 'zod';
import { SessionCreateManyInputObjectSchema } from './objects/SessionCreateManyInput.schema';

export const SessionCreateManySchema = z.object({ data: SessionCreateManyInputObjectSchema });
