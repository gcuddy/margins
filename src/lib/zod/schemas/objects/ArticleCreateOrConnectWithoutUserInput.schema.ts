import { z } from 'zod';
import { ArticleWhereUniqueInputObjectSchema } from './ArticleWhereUniqueInput.schema';
import { ArticleCreateWithoutUserInputObjectSchema } from './ArticleCreateWithoutUserInput.schema';
import { ArticleUncheckedCreateWithoutUserInputObjectSchema } from './ArticleUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ArticleCreateOrConnectWithoutUserInput> = z
	.object({
		where: z.lazy(() => ArticleWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => ArticleCreateWithoutUserInputObjectSchema),
			z.lazy(() => ArticleUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const ArticleCreateOrConnectWithoutUserInputObjectSchema = Schema;
