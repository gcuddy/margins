import { z } from 'zod';
import { ArticleCreateWithoutUserInputObjectSchema } from './ArticleCreateWithoutUserInput.schema';
import { ArticleUncheckedCreateWithoutUserInputObjectSchema } from './ArticleUncheckedCreateWithoutUserInput.schema';
import { ArticleCreateOrConnectWithoutUserInputObjectSchema } from './ArticleCreateOrConnectWithoutUserInput.schema';
import { ArticleUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './ArticleUpsertWithWhereUniqueWithoutUserInput.schema';
import { ArticleCreateManyUserInputEnvelopeObjectSchema } from './ArticleCreateManyUserInputEnvelope.schema';
import { ArticleWhereUniqueInputObjectSchema } from './ArticleWhereUniqueInput.schema';
import { ArticleUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './ArticleUpdateWithWhereUniqueWithoutUserInput.schema';
import { ArticleUpdateManyWithWhereWithoutUserInputObjectSchema } from './ArticleUpdateManyWithWhereWithoutUserInput.schema';
import { ArticleScalarWhereInputObjectSchema } from './ArticleScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ArticleUncheckedUpdateManyWithoutUserNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => ArticleCreateWithoutUserInputObjectSchema),
				z.lazy(() => ArticleCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => ArticleUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => ArticleUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => ArticleCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => ArticleCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => ArticleUpsertWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => ArticleUpsertWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => ArticleCreateManyUserInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => ArticleWhereUniqueInputObjectSchema),
				z.lazy(() => ArticleWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => ArticleWhereUniqueInputObjectSchema),
				z.lazy(() => ArticleWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => ArticleWhereUniqueInputObjectSchema),
				z.lazy(() => ArticleWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => ArticleWhereUniqueInputObjectSchema),
				z.lazy(() => ArticleWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => ArticleUpdateWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => ArticleUpdateWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => ArticleUpdateManyWithWhereWithoutUserInputObjectSchema),
				z.lazy(() => ArticleUpdateManyWithWhereWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => ArticleScalarWhereInputObjectSchema),
				z.lazy(() => ArticleScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const ArticleUncheckedUpdateManyWithoutUserNestedInputObjectSchema = Schema;
