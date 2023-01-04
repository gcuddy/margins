import { z } from 'zod';
import { TagUpdateOneRequiredWithoutTaggingsNestedInputObjectSchema } from './TagUpdateOneRequiredWithoutTaggingsNestedInput.schema';
import { UserUpdateOneRequiredWithoutTaggingsNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutTaggingsNestedInput.schema';
import { FeedUpdateOneWithoutTagsNestedInputObjectSchema } from './FeedUpdateOneWithoutTagsNestedInput.schema';
import { AnnotationUpdateOneWithoutTagsNestedInputObjectSchema } from './AnnotationUpdateOneWithoutTagsNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpdateWithoutBookmarkInput> = z
	.object({
		tag: z.lazy(() => TagUpdateOneRequiredWithoutTaggingsNestedInputObjectSchema).optional(),
		user: z.lazy(() => UserUpdateOneRequiredWithoutTaggingsNestedInputObjectSchema).optional(),
		feed: z.lazy(() => FeedUpdateOneWithoutTagsNestedInputObjectSchema).optional(),
		annotation: z.lazy(() => AnnotationUpdateOneWithoutTagsNestedInputObjectSchema).optional(),
	})
	.strict();

export const TaggingUpdateWithoutBookmarkInputObjectSchema = Schema;
