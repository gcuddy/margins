import { z } from 'zod';
import { CollectionItemsWhereInputObjectSchema } from './objects/CollectionItemsWhereInput.schema';

export const CollectionItemsDeleteManySchema = z.object({
	where: CollectionItemsWhereInputObjectSchema.optional(),
});
