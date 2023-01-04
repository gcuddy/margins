import { z } from 'zod';
import { CollectionItemsWhereUniqueInputObjectSchema } from './objects/CollectionItemsWhereUniqueInput.schema';

export const CollectionItemsDeleteOneSchema = z.object({
	where: CollectionItemsWhereUniqueInputObjectSchema,
});
