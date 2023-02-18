import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteTag, TagModel, CompleteUser, UserModel, CompleteFeed, FeedModel, CompleteAnnotation, AnnotationModel, CompleteBookmark, BookmarkModel } from "./index"

export const _TaggingModel = z.object({
  id: z.number().int(),
  tagId: z.number().int(),
  userId: z.string(),
  feedId: z.number().int().nullish(),
  annotationId: z.number().int().nullish(),
  bookmarkId: z.number().int().nullish(),
})

export interface CompleteTagging extends z.infer<typeof _TaggingModel> {
  tag: CompleteTag
  user: CompleteUser
  feed?: CompleteFeed | null
  annotation?: CompleteAnnotation | null
  bookmark?: CompleteBookmark | null
}

/**
 * TaggingModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const TaggingModel: z.ZodSchema<CompleteTagging> = z.lazy(() => _TaggingModel.extend({
  tag: TagModel,
  user: UserModel,
  feed: FeedModel.nullish(),
  annotation: AnnotationModel.nullish(),
  bookmark: BookmarkModel.nullish(),
}))
