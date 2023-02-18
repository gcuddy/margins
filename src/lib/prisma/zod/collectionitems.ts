import * as z from "zod"
import * as imports from "../zod-utils"
import { CollectionItemType } from "@prisma/client"
import { CompleteCollection, CollectionModel, CompleteAnnotation, AnnotationModel, CompleteBookmark, BookmarkModel, CompleteEntry, EntryModel } from "./index"

export const _CollectionItemsModel = z.object({
  id: z.string(),
  collectionId: z.number().int(),
  position: z.number(),
  note: z.string().nullish(),
  type: z.nativeEnum(CollectionItemType),
  /**
   * This applies to sections only
   */
  title: z.string().nullish(),
  parentId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  annotationId: z.number().int().nullish(),
  bookmarkId: z.number().int().nullish(),
  entryId: z.number().int().nullish(),
})

export interface CompleteCollectionItems extends z.infer<typeof _CollectionItemsModel> {
  collection: CompleteCollection
  children: CompleteCollectionItems[]
  parent?: CompleteCollectionItems | null
  annotation?: CompleteAnnotation | null
  bookmark?: CompleteBookmark | null
  entry?: CompleteEntry | null
}

/**
 * CollectionItemsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const CollectionItemsModel: z.ZodSchema<CompleteCollectionItems> = z.lazy(() => _CollectionItemsModel.extend({
  collection: CollectionModel,
  children: CollectionItemsModel.array(),
  parent: CollectionItemsModel.nullish(),
  annotation: AnnotationModel.nullish(),
  bookmark: BookmarkModel.nullish(),
  entry: EntryModel.nullish(),
}))
