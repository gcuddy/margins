import { z } from 'zod';
import { CollectionWhereUniqueInputObjectSchema } from './objects/CollectionWhereUniqueInput.schema';

export const CollectionFindUniqueSchema = z.object({
	where: CollectionWhereUniqueInputObjectSchema,
});
