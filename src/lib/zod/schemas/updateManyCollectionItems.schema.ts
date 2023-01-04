import { z } from 'zod';
import { CollectionItemsUpdateManyMutationInputObjectSchema } from './objects/CollectionItemsUpdateManyMutationInput.schema';
import { CollectionItemsWhereInputObjectSchema } from './objects/CollectionItemsWhereInput.schema';

export const CollectionItemsUpdateManySchema = z.object({
	data: CollectionItemsUpdateManyMutationInputObjectSchema,
	where: CollectionItemsWhereInputObjectSchema.optional(),
});
