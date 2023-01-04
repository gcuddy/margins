import { z } from 'zod';
import { TagCreateNestedOneWithoutTaggingsInputObjectSchema } from './TagCreateNestedOneWithoutTaggingsInput.schema';
import { FeedCreateNestedOneWithoutTagsInputObjectSchema } from './FeedCreateNestedOneWithoutTagsInput.schema';
import { AnnotationCreateNestedOneWithoutTagsInputObjectSchema } from './AnnotationCreateNestedOneWithoutTagsInput.schema';
import { BookmarkCreateNestedOneWithoutTagsInputObjectSchema } from './BookmarkCreateNestedOneWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateWithoutUserInput> = z
	.object({
		tag: z.lazy(() => TagCreateNestedOneWithoutTaggingsInputObjectSchema),
		feed: z.lazy(() => FeedCreateNestedOneWithoutTagsInputObjectSchema).optional(),
		annotation: z.lazy(() => AnnotationCreateNestedOneWithoutTagsInputObjectSchema).optional(),
		bookmark: z.lazy(() => BookmarkCreateNestedOneWithoutTagsInputObjectSchema).optional(),
	})
	.strict();

export const TaggingCreateWithoutUserInputObjectSchema = Schema;
