import { z } from 'zod';
import { CollectionUpdateInputObjectSchema } from './objects/CollectionUpdateInput.schema';
import { CollectionUncheckedUpdateInputObjectSchema } from './objects/CollectionUncheckedUpdateInput.schema';
import { CollectionWhereUniqueInputObjectSchema } from './objects/CollectionWhereUniqueInput.schema';

export const CollectionUpdateOneSchema = z.object({
	data: z.union([CollectionUpdateInputObjectSchema, CollectionUncheckedUpdateInputObjectSchema]),
	where: CollectionWhereUniqueInputObjectSchema,
});
