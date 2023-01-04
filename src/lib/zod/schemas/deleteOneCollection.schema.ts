import { z } from 'zod';
import { CollectionWhereUniqueInputObjectSchema } from './objects/CollectionWhereUniqueInput.schema';

export const CollectionDeleteOneSchema = z.object({
	where: CollectionWhereUniqueInputObjectSchema,
});
