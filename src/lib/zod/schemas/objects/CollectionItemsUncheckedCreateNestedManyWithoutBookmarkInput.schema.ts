import { z } from 'zod';
import { CollectionItemsCreateWithoutBookmarkInputObjectSchema } from './CollectionItemsCreateWithoutBookmarkInput.schema';
import { CollectionItemsUncheckedCreateWithoutBookmarkInputObjectSchema } from './CollectionItemsUncheckedCreateWithoutBookmarkInput.schema';
import { CollectionItemsCreateOrConnectWithoutBookmarkInputObjectSchema } from './CollectionItemsCreateOrConnectWithoutBookmarkInput.schema';
import { CollectionItemsCreateManyBookmarkInputEnvelopeObjectSchema } from './CollectionItemsCreateManyBookmarkInputEnvelope.schema';
import { CollectionItemsWhereUniqueInputObjectSchema } from './CollectionItemsWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsUncheckedCreateNestedManyWithoutBookmarkInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => CollectionItemsCreateWithoutBookmarkInputObjectSchema),
				z.lazy(() => CollectionItemsCreateWithoutBookmarkInputObjectSchema).array(),
				z.lazy(() => CollectionItemsUncheckedCreateWithoutBookmarkInputObjectSchema),
				z.lazy(() => CollectionItemsUncheckedCreateWithoutBookmarkInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => CollectionItemsCreateOrConnectWithoutBookmarkInputObjectSchema),
				z.lazy(() => CollectionItemsCreateOrConnectWithoutBookmarkInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => CollectionItemsCreateManyBookmarkInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema),
				z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const CollectionItemsUncheckedCreateNestedManyWithoutBookmarkInputObjectSchema = Schema;
