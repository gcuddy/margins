import { z } from 'zod';
import { EntryWhereUniqueInputObjectSchema } from './objects/EntryWhereUniqueInput.schema';

export const EntryFindUniqueSchema = z.object({ where: EntryWhereUniqueInputObjectSchema });
