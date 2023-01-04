import { z } from 'zod';
import { CollectionItemsCreateManyInputObjectSchema } from './objects/CollectionItemsCreateManyInput.schema';

export const CollectionItemsCreateManySchema = z.object({
	data: CollectionItemsCreateManyInputObjectSchema,
});
