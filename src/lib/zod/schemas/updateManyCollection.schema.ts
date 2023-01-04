import { z } from 'zod';
import { CollectionUpdateManyMutationInputObjectSchema } from './objects/CollectionUpdateManyMutationInput.schema';
import { CollectionWhereInputObjectSchema } from './objects/CollectionWhereInput.schema';

export const CollectionUpdateManySchema = z.object({
	data: CollectionUpdateManyMutationInputObjectSchema,
	where: CollectionWhereInputObjectSchema.optional(),
});
