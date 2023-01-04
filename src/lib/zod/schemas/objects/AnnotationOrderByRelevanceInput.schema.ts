import { z } from 'zod';
import { AnnotationOrderByRelevanceFieldEnumSchema } from '../enums/AnnotationOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => AnnotationOrderByRelevanceFieldEnumSchema),
			z.lazy(() => AnnotationOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const AnnotationOrderByRelevanceInputObjectSchema = Schema;
