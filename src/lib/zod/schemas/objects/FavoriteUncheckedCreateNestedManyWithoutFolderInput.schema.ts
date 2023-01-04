import { z } from 'zod';
import { FavoriteCreateWithoutFolderInputObjectSchema } from './FavoriteCreateWithoutFolderInput.schema';
import { FavoriteUncheckedCreateWithoutFolderInputObjectSchema } from './FavoriteUncheckedCreateWithoutFolderInput.schema';
import { FavoriteCreateOrConnectWithoutFolderInputObjectSchema } from './FavoriteCreateOrConnectWithoutFolderInput.schema';
import { FavoriteCreateManyFolderInputEnvelopeObjectSchema } from './FavoriteCreateManyFolderInputEnvelope.schema';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUncheckedCreateNestedManyWithoutFolderInput> = z
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
		createMany: z.lazy(() => FavoriteCreateManyFolderInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => FavoriteWhereUniqueInputObjectSchema),
				z.lazy(() => FavoriteWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const FavoriteUncheckedCreateNestedManyWithoutFolderInputObjectSchema = Schema;
