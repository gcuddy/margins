import { z } from 'zod';
import { ArticleCreateWithoutUserInputObjectSchema } from './ArticleCreateWithoutUserInput.schema';
import { ArticleUncheckedCreateWithoutUserInputObjectSchema } from './ArticleUncheckedCreateWithoutUserInput.schema';
import { ArticleCreateOrConnectWithoutUserInputObjectSchema } from './ArticleCreateOrConnectWithoutUserInput.schema';
import { ArticleCreateManyUserInputEnvelopeObjectSchema } from './ArticleCreateManyUserInputEnvelope.schema';
import { ArticleWhereUniqueInputObjectSchema } from './ArticleWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ArticleUncheckedCreateNestedManyWithoutUserInput> = z
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
		createMany: z.lazy(() => ArticleCreateManyUserInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => ArticleWhereUniqueInputObjectSchema),
				z.lazy(() => ArticleWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const ArticleUncheckedCreateNestedManyWithoutUserInputObjectSchema = Schema;
