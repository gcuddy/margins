import { z } from 'zod';
import { EntryWhereInputObjectSchema } from './objects/EntryWhereInput.schema';

export const EntryDeleteManySchema = z.object({ where: EntryWhereInputObjectSchema.optional() });
