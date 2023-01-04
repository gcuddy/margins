import { z } from 'zod';
import { FavoriteCreateWithoutUserInputObjectSchema } from './FavoriteCreateWithoutUserInput.schema';
import { FavoriteUncheckedCreateWithoutUserInputObjectSchema } from './FavoriteUncheckedCreateWithoutUserInput.schema';
import { FavoriteCreateOrConnectWithoutUserInputObjectSchema } from './FavoriteCreateOrConnectWithoutUserInput.schema';
import { FavoriteUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './FavoriteUpsertWithWhereUniqueWithoutUserInput.schema';
import { FavoriteCreateManyUserInputEnvelopeObjectSchema } from './FavoriteCreateManyUserInputEnvelope.schema';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './FavoriteUpdateWithWhereUniqueWithoutUserInput.schema';
import { FavoriteUpdateManyWithWhereWithoutUserInputObjectSchema } from './FavoriteUpdateManyWithWhereWithoutUserInput.schema';
import { FavoriteScalarWhereInputObjectSchema } from './FavoriteScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUncheckedUpdateManyWithoutUserNestedInput> = z
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
		upsert: z
			.union([
				z.lazy(() => FavoriteUpsertWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => FavoriteUpsertWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => FavoriteCreateManyUserInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => FavoriteWhereUniqueInputObjectSchema),
				z.lazy(() => FavoriteWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => FavoriteWhereUniqueInputObjectSchema),
				z.lazy(() => FavoriteWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => FavoriteWhereUniqueInputObjectSchema),
				z.lazy(() => FavoriteWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => FavoriteWhereUniqueInputObjectSchema),
				z.lazy(() => FavoriteWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => FavoriteUpdateWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => FavoriteUpdateWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => FavoriteUpdateManyWithWhereWithoutUserInputObjectSchema),
				z.lazy(() => FavoriteUpdateManyWithWhereWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => FavoriteScalarWhereInputObjectSchema),
				z.lazy(() => FavoriteScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const FavoriteUncheckedUpdateManyWithoutUserNestedInputObjectSchema = Schema;
