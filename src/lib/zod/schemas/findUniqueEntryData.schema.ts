import { z } from 'zod';
import { EntryDataWhereUniqueInputObjectSchema } from './objects/EntryDataWhereUniqueInput.schema';

export const EntryDataFindUniqueSchema = z.object({ where: EntryDataWhereUniqueInputObjectSchema });
