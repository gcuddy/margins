import { z } from 'zod';
import { CollectionCreateWithoutUserInputObjectSchema } from './CollectionCreateWithoutUserInput.schema';
import { CollectionUncheckedCreateWithoutUserInputObjectSchema } from './CollectionUncheckedCreateWithoutUserInput.schema';
import { CollectionCreateOrConnectWithoutUserInputObjectSchema } from './CollectionCreateOrConnectWithoutUserInput.schema';
import { CollectionCreateManyUserInputEnvelopeObjectSchema } from './CollectionCreateManyUserInputEnvelope.schema';
import { CollectionWhereUniqueInputObjectSchema } from './CollectionWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionUncheckedCreateNestedManyWithoutUserInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => CollectionCreateWithoutUserInputObjectSchema),
				z.lazy(() => CollectionCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => CollectionUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => CollectionUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => CollectionCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => CollectionCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => CollectionCreateManyUserInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => CollectionWhereUniqueInputObjectSchema),
				z.lazy(() => CollectionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const CollectionUncheckedCreateNestedManyWithoutUserInputObjectSchema = Schema;
