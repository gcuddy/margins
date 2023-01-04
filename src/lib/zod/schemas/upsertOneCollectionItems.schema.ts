import { z } from 'zod';
import { CollectionItemsWhereUniqueInputObjectSchema } from './objects/CollectionItemsWhereUniqueInput.schema';
import { CollectionItemsCreateInputObjectSchema } from './objects/CollectionItemsCreateInput.schema';
import { CollectionItemsUncheckedCreateInputObjectSchema } from './objects/CollectionItemsUncheckedCreateInput.schema';
import { CollectionItemsUpdateInputObjectSchema } from './objects/CollectionItemsUpdateInput.schema';
import { CollectionItemsUncheckedUpdateInputObjectSchema } from './objects/CollectionItemsUncheckedUpdateInput.schema';

export const CollectionItemsUpsertSchema = z.object({
	where: CollectionItemsWhereUniqueInputObjectSchema,
	create: z.union([
		CollectionItemsCreateInputObjectSchema,
		CollectionItemsUncheckedCreateInputObjectSchema,
	]),
	update: z.union([
		CollectionItemsUpdateInputObjectSchema,
		CollectionItemsUncheckedUpdateInputObjectSchema,
	]),
});
