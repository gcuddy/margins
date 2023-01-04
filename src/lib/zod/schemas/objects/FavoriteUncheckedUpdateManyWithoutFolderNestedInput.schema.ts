import { z } from 'zod';
import { FavoriteCreateWithoutFolderInputObjectSchema } from './FavoriteCreateWithoutFolderInput.schema';
import { FavoriteUncheckedCreateWithoutFolderInputObjectSchema } from './FavoriteUncheckedCreateWithoutFolderInput.schema';
import { FavoriteCreateOrConnectWithoutFolderInputObjectSchema } from './FavoriteCreateOrConnectWithoutFolderInput.schema';
import { FavoriteUpsertWithWhereUniqueWithoutFolderInputObjectSchema } from './FavoriteUpsertWithWhereUniqueWithoutFolderInput.schema';
import { FavoriteCreateManyFolderInputEnvelopeObjectSchema } from './FavoriteCreateManyFolderInputEnvelope.schema';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteUpdateWithWhereUniqueWithoutFolderInputObjectSchema } from './FavoriteUpdateWithWhereUniqueWithoutFolderInput.schema';
import { FavoriteUpdateManyWithWhereWithoutFolderInputObjectSchema } from './FavoriteUpdateManyWithWhereWithoutFolderInput.schema';
import { FavoriteScalarWhereInputObjectSchema } from './FavoriteScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUncheckedUpdateManyWithoutFolderNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FavoriteCreateWithoutFolderInputObjectSchema),
				z.lazy(() => FavoriteCreateWithoutFolderInputObjectSchema).array(),
				z.lazy(() => FavoriteUncheckedCreateWithoutFolderInputObjectSchema),
				z.lazy(() => FavoriteUncheckedCreateWithoutFolderInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => FavoriteCreateOrConnectWithoutFolderInputObjectSchema),
				z.lazy(() => FavoriteCreateOrConnectWithoutFolderInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => FavoriteUpsertWithWhereUniqueWithoutFolderInputObjectSchema),
				z.lazy(() => FavoriteUpsertWithWhereUniqueWithoutFolderInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => FavoriteCreateManyFolderInputEnvelopeObjectSchema).optional(),
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
				z.lazy(() => FavoriteUpdateWithWhereUniqueWithoutFolderInputObjectSchema),
				z.lazy(() => FavoriteUpdateWithWhereUniqueWithoutFolderInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => FavoriteUpdateManyWithWhereWithoutFolderInputObjectSchema),
				z.lazy(() => FavoriteUpdateManyWithWhereWithoutFolderInputObjectSchema).array(),
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

export const FavoriteUncheckedUpdateManyWithoutFolderNestedInputObjectSchema = Schema;
