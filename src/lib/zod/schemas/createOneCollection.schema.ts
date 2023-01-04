import { z } from 'zod';
import { CollectionCreateInputObjectSchema } from './objects/CollectionCreateInput.schema';
import { CollectionUncheckedCreateInputObjectSchema } from './objects/CollectionUncheckedCreateInput.schema';

export const CollectionCreateOneSchema = z.object({
	data: z.union([CollectionCreateInputObjectSchema, CollectionUncheckedCreateInputObjectSchema]),
});
