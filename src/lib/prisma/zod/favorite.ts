import * as z from "zod"
import * as imports from "../zod-utils"
import { FavoriteType } from "@prisma/client"
import { CompleteUser, UserModel, CompleteTag, TagModel, CompleteFeed, FeedModel, CompleteSmartList, SmartListModel, CompleteAnnotation, AnnotationModel, CompleteBookmark, BookmarkModel, CompleteCollection, CollectionModel, CompleteEntry, EntryModel } from "./index"

export const _FavoriteModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  sortOrder: z.number().nullish(),
  userId: z.string(),
  deleted: z.date().nullish(),
  tagId: z.number().int().nullish(),
  feedId: z.number().int().nullish(),
  smartListId: z.number().int().nullish(),
  type: z.nativeEnum(FavoriteType),
  /**
   * The name of the folder. Only applies to favorites of type folder.
   */
  folderName: z.string().nullish(),
  parentId: z.string().nullish(),
  annotationId: z.string().nullish(),
  bookmarkId: z.number().int().nullish(),
  collectionId: z.number().int().nullish(),
  entryId: z.number().int().nullish(),
})

export interface CompleteFavorite extends z.infer<typeof _FavoriteModel> {
  user: CompleteUser
  tag?: CompleteTag | null
  feed?: CompleteFeed | null
  smartList?: CompleteSmartList | null
  parent?: CompleteFavorite | null
  children: CompleteFavorite[]
  annotation?: CompleteAnnotation | null
  bookmark?: CompleteBookmark | null
  collection?: CompleteCollection | null
  entry?: CompleteEntry | null
}

/**
 * FavoriteModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const FavoriteModel: z.ZodSchema<CompleteFavorite> = z.lazy(() => _FavoriteModel.extend({
  user: UserModel,
  tag: TagModel.nullish(),
  feed: FeedModel.nullish(),
  smartList: SmartListModel.nullish(),
  parent: FavoriteModel.nullish(),
  children: FavoriteModel.array(),
  annotation: AnnotationModel.nullish(),
  bookmark: BookmarkModel.nullish(),
  collection: CollectionModel.nullish(),
  entry: EntryModel.nullish(),
}))
