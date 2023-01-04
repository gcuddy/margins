import { z } from 'zod';
import { EntryDataWhereUniqueInputObjectSchema } from './objects/EntryDataWhereUniqueInput.schema';

export const EntryDataDeleteOneSchema = z.object({ where: EntryDataWhereUniqueInputObjectSchema });
