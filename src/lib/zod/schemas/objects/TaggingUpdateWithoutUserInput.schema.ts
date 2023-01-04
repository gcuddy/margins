import { z } from 'zod';
import { TagUpdateOneRequiredWithoutTaggingsNestedInputObjectSchema } from './TagUpdateOneRequiredWithoutTaggingsNestedInput.schema';
import { FeedUpdateOneWithoutTagsNestedInputObjectSchema } from './FeedUpdateOneWithoutTagsNestedInput.schema';
import { AnnotationUpdateOneWithoutTagsNestedInputObjectSchema } from './AnnotationUpdateOneWithoutTagsNestedInput.schema';
import { BookmarkUpdateOneWithoutTagsNestedInputObjectSchema } from './BookmarkUpdateOneWithoutTagsNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpdateWithoutUserInput> = z
	.object({
		tag: z.lazy(() => TagUpdateOneRequiredWithoutTaggingsNestedInputObjectSchema).optional(),
		feed: z.lazy(() => FeedUpdateOneWithoutTagsNestedInputObjectSchema).optional(),
		annotation: z.lazy(() => AnnotationUpdateOneWithoutTagsNestedInputObjectSchema).optional(),
		bookmark: z.lazy(() => BookmarkUpdateOneWithoutTagsNestedInputObjectSchema).optional(),
	})
	.strict();

export const TaggingUpdateWithoutUserInputObjectSchema = Schema;
