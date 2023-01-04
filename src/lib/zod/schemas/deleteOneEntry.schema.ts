import { z } from 'zod';
import { EntryWhereUniqueInputObjectSchema } from './objects/EntryWhereUniqueInput.schema';

export const EntryDeleteOneSchema = z.object({ where: EntryWhereUniqueInputObjectSchema });
