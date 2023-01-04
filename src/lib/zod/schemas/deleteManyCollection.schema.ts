import { z } from 'zod';
import { CollectionWhereInputObjectSchema } from './objects/CollectionWhereInput.schema';

export const CollectionDeleteManySchema = z.object({
	where: CollectionWhereInputObjectSchema.optional(),
});
