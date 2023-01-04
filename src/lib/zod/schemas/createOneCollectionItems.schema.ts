import { z } from 'zod';
import { CollectionItemsCreateInputObjectSchema } from './objects/CollectionItemsCreateInput.schema';
import { CollectionItemsUncheckedCreateInputObjectSchema } from './objects/CollectionItemsUncheckedCreateInput.schema';

export const CollectionItemsCreateOneSchema = z.object({
	data: z.union([
		CollectionItemsCreateInputObjectSchema,
		CollectionItemsUncheckedCreateInputObjectSchema,
	]),
});
