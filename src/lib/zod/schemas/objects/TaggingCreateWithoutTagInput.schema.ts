import { z } from 'zod';
import { UserCreateNestedOneWithoutTaggingsInputObjectSchema } from './UserCreateNestedOneWithoutTaggingsInput.schema';
import { FeedCreateNestedOneWithoutTagsInputObjectSchema } from './FeedCreateNestedOneWithoutTagsInput.schema';
import { AnnotationCreateNestedOneWithoutTagsInputObjectSchema } from './AnnotationCreateNestedOneWithoutTagsInput.schema';
import { BookmarkCreateNestedOneWithoutTagsInputObjectSchema } from './BookmarkCreateNestedOneWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateWithoutTagInput> = z
	.object({
		user: z.lazy(() => UserCreateNestedOneWithoutTaggingsInputObjectSchema),
		feed: z.lazy(() => FeedCreateNestedOneWithoutTagsInputObjectSchema).optional(),
		annotation: z.lazy(() => AnnotationCreateNestedOneWithoutTagsInputObjectSchema).optional(),
		bookmark: z.lazy(() => BookmarkCreateNestedOneWithoutTagsInputObjectSchema).optional(),
	})
	.strict();

export const TaggingCreateWithoutTagInputObjectSchema = Schema;
