import { z } from 'zod';
import { FavoriteCreateWithoutUserInputObjectSchema } from './FavoriteCreateWithoutUserInput.schema';
import { FavoriteUncheckedCreateWithoutUserInputObjectSchema } from './FavoriteUncheckedCreateWithoutUserInput.schema';
import { FavoriteCreateOrConnectWithoutUserInputObjectSchema } from './FavoriteCreateOrConnectWithoutUserInput.schema';
import { FavoriteCreateManyUserInputEnvelopeObjectSchema } from './FavoriteCreateManyUserInputEnvelope.schema';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteCreateNestedManyWithoutUserInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FavoriteCreateWithoutUserInputObjectSchema),
				z.lazy(() => FavoriteCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => FavoriteUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => FavoriteUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => FavoriteCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => FavoriteCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => FavoriteCreateManyUserInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => FavoriteWhereUniqueInputObjectSchema),
				z.lazy(() => FavoriteWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const FavoriteCreateNestedManyWithoutUserInputObjectSchema = Schema;
