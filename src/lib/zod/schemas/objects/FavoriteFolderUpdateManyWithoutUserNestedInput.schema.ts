import { z } from 'zod';
import { FavoriteFolderCreateWithoutUserInputObjectSchema } from './FavoriteFolderCreateWithoutUserInput.schema';
import { FavoriteFolderUncheckedCreateWithoutUserInputObjectSchema } from './FavoriteFolderUncheckedCreateWithoutUserInput.schema';
import { FavoriteFolderCreateOrConnectWithoutUserInputObjectSchema } from './FavoriteFolderCreateOrConnectWithoutUserInput.schema';
import { FavoriteFolderUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './FavoriteFolderUpsertWithWhereUniqueWithoutUserInput.schema';
import { FavoriteFolderCreateManyUserInputEnvelopeObjectSchema } from './FavoriteFolderCreateManyUserInputEnvelope.schema';
import { FavoriteFolderWhereUniqueInputObjectSchema } from './FavoriteFolderWhereUniqueInput.schema';
import { FavoriteFolderUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './FavoriteFolderUpdateWithWhereUniqueWithoutUserInput.schema';
import { FavoriteFolderUpdateManyWithWhereWithoutUserInputObjectSchema } from './FavoriteFolderUpdateManyWithWhereWithoutUserInput.schema';
import { FavoriteFolderScalarWhereInputObjectSchema } from './FavoriteFolderScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderUpdateManyWithoutUserNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FavoriteFolderCreateWithoutUserInputObjectSchema),
				z.lazy(() => FavoriteFolderCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => FavoriteFolderUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => FavoriteFolderUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => FavoriteFolderCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => FavoriteFolderCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => FavoriteFolderUpsertWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => FavoriteFolderUpsertWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => FavoriteFolderCreateManyUserInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => FavoriteFolderWhereUniqueInputObjectSchema),
				z.lazy(() => FavoriteFolderWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => FavoriteFolderWhereUniqueInputObjectSchema),
				z.lazy(() => FavoriteFolderWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => FavoriteFolderWhereUniqueInputObjectSchema),
				z.lazy(() => FavoriteFolderWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => FavoriteFolderWhereUniqueInputObjectSchema),
				z.lazy(() => FavoriteFolderWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => FavoriteFolderUpdateWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => FavoriteFolderUpdateWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => FavoriteFolderUpdateManyWithWhereWithoutUserInputObjectSchema),
				z.lazy(() => FavoriteFolderUpdateManyWithWhereWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => FavoriteFolderScalarWhereInputObjectSchema),
				z.lazy(() => FavoriteFolderScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const FavoriteFolderUpdateManyWithoutUserNestedInputObjectSchema = Schema;
