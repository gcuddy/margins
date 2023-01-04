import { z } from 'zod';
import { UserEntryCreateManyInputObjectSchema } from './objects/UserEntryCreateManyInput.schema';

export const UserEntryCreateManySchema = z.object({ data: UserEntryCreateManyInputObjectSchema });
