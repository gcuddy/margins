import { z } from 'zod';
import { FavoriteFolderCreateWithoutUserInputObjectSchema } from './FavoriteFolderCreateWithoutUserInput.schema';
import { FavoriteFolderUncheckedCreateWithoutUserInputObjectSchema } from './FavoriteFolderUncheckedCreateWithoutUserInput.schema';
import { FavoriteFolderCreateOrConnectWithoutUserInputObjectSchema } from './FavoriteFolderCreateOrConnectWithoutUserInput.schema';
import { FavoriteFolderCreateManyUserInputEnvelopeObjectSchema } from './FavoriteFolderCreateManyUserInputEnvelope.schema';
import { FavoriteFolderWhereUniqueInputObjectSchema } from './FavoriteFolderWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderCreateNestedManyWithoutUserInput> = z
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
		createMany: z.lazy(() => FavoriteFolderCreateManyUserInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => FavoriteFolderWhereUniqueInputObjectSchema),
				z.lazy(() => FavoriteFolderWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const FavoriteFolderCreateNestedManyWithoutUserInputObjectSchema = Schema;
