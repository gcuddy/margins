import { z } from 'zod';
import { EntryTagWhereUniqueInputObjectSchema } from './objects/EntryTagWhereUniqueInput.schema';

export const EntryTagDeleteOneSchema = z.object({ where: EntryTagWhereUniqueInputObjectSchema });
