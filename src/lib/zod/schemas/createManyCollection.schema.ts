import { z } from 'zod';
import { CollectionCreateManyInputObjectSchema } from './objects/CollectionCreateManyInput.schema';

export const CollectionCreateManySchema = z.object({ data: CollectionCreateManyInputObjectSchema });
