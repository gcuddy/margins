import { z } from 'zod';
import { CollectionWhereUniqueInputObjectSchema } from './objects/CollectionWhereUniqueInput.schema';
import { CollectionCreateInputObjectSchema } from './objects/CollectionCreateInput.schema';
import { CollectionUncheckedCreateInputObjectSchema } from './objects/CollectionUncheckedCreateInput.schema';
import { CollectionUpdateInputObjectSchema } from './objects/CollectionUpdateInput.schema';
import { CollectionUncheckedUpdateInputObjectSchema } from './objects/CollectionUncheckedUpdateInput.schema';

export const CollectionUpsertSchema = z.object({
	where: CollectionWhereUniqueInputObjectSchema,
	create: z.union([CollectionCreateInputObjectSchema, CollectionUncheckedCreateInputObjectSchema]),
	update: z.union([CollectionUpdateInputObjectSchema, CollectionUncheckedUpdateInputObjectSchema]),
});
