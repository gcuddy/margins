import { z } from 'zod';
import { TagUpdateOneRequiredWithoutTaggingsNestedInputObjectSchema } from './TagUpdateOneRequiredWithoutTaggingsNestedInput.schema';
import { UserUpdateOneRequiredWithoutTaggingsNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutTaggingsNestedInput.schema';
import { AnnotationUpdateOneWithoutTagsNestedInputObjectSchema } from './AnnotationUpdateOneWithoutTagsNestedInput.schema';
import { BookmarkUpdateOneWithoutTagsNestedInputObjectSchema } from './BookmarkUpdateOneWithoutTagsNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpdateWithoutFeedInput> = z
	.object({
		tag: z.lazy(() => TagUpdateOneRequiredWithoutTaggingsNestedInputObjectSchema).optional(),
		user: z.lazy(() => UserUpdateOneRequiredWithoutTaggingsNestedInputObjectSchema).optional(),
		annotation: z.lazy(() => AnnotationUpdateOneWithoutTagsNestedInputObjectSchema).optional(),
		bookmark: z.lazy(() => BookmarkUpdateOneWithoutTagsNestedInputObjectSchema).optional(),
	})
	.strict();

export const TaggingUpdateWithoutFeedInputObjectSchema = Schema;
