import * as z from "zod"
import * as imports from "../zod-utils"
import { AnnotationType, Color } from "@prisma/client"
import { CompleteTagging, TaggingModel, CompleteEntry, EntryModel, CompleteUser, UserModel, CompleteCollectionItems, CollectionItemsModel, CompleteFavorite, FavoriteModel, CompleteBookmark, BookmarkModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const _AnnotationModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  body: jsonSchema,
  contentData: jsonSchema,
  /**
   * Optional title, used for longer notes unassociated with an entryo
   */
  title: z.string().nullish(),
  editedAt: z.date().nullish(),
  type: z.nativeEnum(AnnotationType),
  private: z.boolean(),
  target: imports.TargetSchema,
  entryId: z.number().int().nullish(),
  parentId: z.string().nullish(),
  /**
   * The "soft delete" time. Deletions are cleared after 30 days.
   */
  deleted: z.date().nullish(),
  userId: z.string(),
  sortOrder: z.number(),
  bookmarkId: z.number().int().nullish(),
  color: z.nativeEnum(Color),
  colorId: z.string().nullish(),
})

export interface CompleteAnnotation extends z.infer<typeof _AnnotationModel> {
  tags: CompleteTagging[]
  entry?: CompleteEntry | null
  parent?: CompleteAnnotation | null
  children: CompleteAnnotation[]
  creator: CompleteUser
  collections?: CompleteCollectionItems | null
  favorite?: CompleteFavorite | null
  bookmark?: CompleteBookmark | null
}

/**
 * AnnotationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const AnnotationModel: z.ZodSchema<CompleteAnnotation> = z.lazy(() => _AnnotationModel.extend({
  tags: TaggingModel.array(),
  entry: EntryModel.nullish(),
  /**
   * An annotation will have a parent when it's a reply
   */
  parent: AnnotationModel.nullish(),
  children: AnnotationModel.array(),
  creator: UserModel,
  collections: CollectionItemsModel.nullish(),
  favorite: FavoriteModel.nullish(),
  bookmark: BookmarkModel.nullish(),
}))
