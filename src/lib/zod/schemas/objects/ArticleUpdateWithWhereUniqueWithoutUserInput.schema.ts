import { z } from 'zod';
import { ArticleWhereUniqueInputObjectSchema } from './ArticleWhereUniqueInput.schema';
import { ArticleUpdateWithoutUserInputObjectSchema } from './ArticleUpdateWithoutUserInput.schema';
import { ArticleUncheckedUpdateWithoutUserInputObjectSchema } from './ArticleUncheckedUpdateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ArticleUpdateWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => ArticleWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => ArticleUpdateWithoutUserInputObjectSchema),
			z.lazy(() => ArticleUncheckedUpdateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const ArticleUpdateWithWhereUniqueWithoutUserInputObjectSchema = Schema;
