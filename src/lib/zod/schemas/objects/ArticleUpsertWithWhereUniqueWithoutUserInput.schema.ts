import { z } from 'zod';
import { ArticleWhereUniqueInputObjectSchema } from './ArticleWhereUniqueInput.schema';
import { ArticleUpdateWithoutUserInputObjectSchema } from './ArticleUpdateWithoutUserInput.schema';
import { ArticleUncheckedUpdateWithoutUserInputObjectSchema } from './ArticleUncheckedUpdateWithoutUserInput.schema';
import { ArticleCreateWithoutUserInputObjectSchema } from './ArticleCreateWithoutUserInput.schema';
import { ArticleUncheckedCreateWithoutUserInputObjectSchema } from './ArticleUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ArticleUpsertWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => ArticleWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => ArticleUpdateWithoutUserInputObjectSchema),
			z.lazy(() => ArticleUncheckedUpdateWithoutUserInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => ArticleCreateWithoutUserInputObjectSchema),
			z.lazy(() => ArticleUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const ArticleUpsertWithWhereUniqueWithoutUserInputObjectSchema = Schema;
