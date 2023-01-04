import { z } from 'zod';
import { CollectionItemsUpdateInputObjectSchema } from './objects/CollectionItemsUpdateInput.schema';
import { CollectionItemsUncheckedUpdateInputObjectSchema } from './objects/CollectionItemsUncheckedUpdateInput.schema';
import { CollectionItemsWhereUniqueInputObjectSchema } from './objects/CollectionItemsWhereUniqueInput.schema';

export const CollectionItemsUpdateOneSchema = z.object({
	data: z.union([
		CollectionItemsUpdateInputObjectSchema,
		CollectionItemsUncheckedUpdateInputObjectSchema,
	]),
	where: CollectionItemsWhereUniqueInputObjectSchema,
});
