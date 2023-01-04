import { z } from 'zod';
import { TagUpdateOneRequiredWithoutTaggingsNestedInputObjectSchema } from './TagUpdateOneRequiredWithoutTaggingsNestedInput.schema';
import { UserUpdateOneRequiredWithoutTaggingsNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutTaggingsNestedInput.schema';
import { FeedUpdateOneWithoutTagsNestedInputObjectSchema } from './FeedUpdateOneWithoutTagsNestedInput.schema';
import { BookmarkUpdateOneWithoutTagsNestedInputObjectSchema } from './BookmarkUpdateOneWithoutTagsNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpdateWithoutAnnotationInput> = z
	.object({
		tag: z.lazy(() => TagUpdateOneRequiredWithoutTaggingsNestedInputObjectSchema).optional(),
		user: z.lazy(() => UserUpdateOneRequiredWithoutTaggingsNestedInputObjectSchema).optional(),
		feed: z.lazy(() => FeedUpdateOneWithoutTagsNestedInputObjectSchema).optional(),
		bookmark: z.lazy(() => BookmarkUpdateOneWithoutTagsNestedInputObjectSchema).optional(),
	})
	.strict();

export const TaggingUpdateWithoutAnnotationInputObjectSchema = Schema;
