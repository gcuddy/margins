import { z } from 'zod';
import { CollectionItemsWhereUniqueInputObjectSchema } from './objects/CollectionItemsWhereUniqueInput.schema';

export const CollectionItemsFindUniqueSchema = z.object({
	where: CollectionItemsWhereUniqueInputObjectSchema,
});
