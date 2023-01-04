import { z } from 'zod';
import { EntryTagWhereUniqueInputObjectSchema } from './objects/EntryTagWhereUniqueInput.schema';

export const EntryTagFindUniqueSchema = z.object({ where: EntryTagWhereUniqueInputObjectSchema });
