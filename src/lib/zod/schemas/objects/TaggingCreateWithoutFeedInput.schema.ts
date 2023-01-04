import { z } from 'zod';
import { TagCreateNestedOneWithoutTaggingsInputObjectSchema } from './TagCreateNestedOneWithoutTaggingsInput.schema';
import { UserCreateNestedOneWithoutTaggingsInputObjectSchema } from './UserCreateNestedOneWithoutTaggingsInput.schema';
import { AnnotationCreateNestedOneWithoutTagsInputObjectSchema } from './AnnotationCreateNestedOneWithoutTagsInput.schema';
import { BookmarkCreateNestedOneWithoutTagsInputObjectSchema } from './BookmarkCreateNestedOneWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateWithoutFeedInput> = z
	.object({
		tag: z.lazy(() => TagCreateNestedOneWithoutTaggingsInputObjectSchema),
		user: z.lazy(() => UserCreateNestedOneWithoutTaggingsInputObjectSchema),
		annotation: z.lazy(() => AnnotationCreateNestedOneWithoutTagsInputObjectSchema).optional(),
		bookmark: z.lazy(() => BookmarkCreateNestedOneWithoutTagsInputObjectSchema).optional(),
	})
	.strict();

export const TaggingCreateWithoutFeedInputObjectSchema = Schema;
