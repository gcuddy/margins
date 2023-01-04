import { z } from 'zod';
import { TagCreateNestedOneWithoutTaggingsInputObjectSchema } from './TagCreateNestedOneWithoutTaggingsInput.schema';
import { UserCreateNestedOneWithoutTaggingsInputObjectSchema } from './UserCreateNestedOneWithoutTaggingsInput.schema';
import { FeedCreateNestedOneWithoutTagsInputObjectSchema } from './FeedCreateNestedOneWithoutTagsInput.schema';
import { AnnotationCreateNestedOneWithoutTagsInputObjectSchema } from './AnnotationCreateNestedOneWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateWithoutBookmarkInput> = z
	.object({
		tag: z.lazy(() => TagCreateNestedOneWithoutTaggingsInputObjectSchema),
		user: z.lazy(() => UserCreateNestedOneWithoutTaggingsInputObjectSchema),
		feed: z.lazy(() => FeedCreateNestedOneWithoutTagsInputObjectSchema).optional(),
		annotation: z.lazy(() => AnnotationCreateNestedOneWithoutTagsInputObjectSchema).optional(),
	})
	.strict();

export const TaggingCreateWithoutBookmarkInputObjectSchema = Schema;
