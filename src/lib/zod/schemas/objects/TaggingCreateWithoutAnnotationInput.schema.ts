import { z } from 'zod';
import { TagCreateNestedOneWithoutTaggingsInputObjectSchema } from './TagCreateNestedOneWithoutTaggingsInput.schema';
import { UserCreateNestedOneWithoutTaggingsInputObjectSchema } from './UserCreateNestedOneWithoutTaggingsInput.schema';
import { FeedCreateNestedOneWithoutTagsInputObjectSchema } from './FeedCreateNestedOneWithoutTagsInput.schema';
import { BookmarkCreateNestedOneWithoutTagsInputObjectSchema } from './BookmarkCreateNestedOneWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateWithoutAnnotationInput> = z
	.object({
		tag: z.lazy(() => TagCreateNestedOneWithoutTaggingsInputObjectSchema),
		user: z.lazy(() => UserCreateNestedOneWithoutTaggingsInputObjectSchema),
		feed: z.lazy(() => FeedCreateNestedOneWithoutTagsInputObjectSchema).optional(),
		bookmark: z.lazy(() => BookmarkCreateNestedOneWithoutTagsInputObjectSchema).optional(),
	})
	.strict();

export const TaggingCreateWithoutAnnotationInputObjectSchema = Schema;
