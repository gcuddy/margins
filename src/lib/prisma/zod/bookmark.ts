import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteEntry, EntryModel, CompleteUser, UserModel, CompleteState, StateModel, CompleteTagging, TaggingModel, CompleteCollectionItems, CollectionItemsModel, CompleteInteraction, InteractionModel, CompleteFavorite, FavoriteModel, CompleteAnnotation, AnnotationModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const _BookmarkModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  context: jsonSchema,
  uri: z.string().nullish(),
  entryId: z.number().int().nullish(),
  userId: z.string(),
  sortOrder: z.number().int().nullish(),
  is_read: z.boolean(),
  progress: z.number(),
  screenshot: z.string().nullish(),
  data: jsonSchema,
  dueDate: z.date().nullish(),
  snoozedUntil: z.date().nullish(),
  source: z.string().nullish(),
  stateId: z.number().int().nullish(),
  private: z.boolean(),
  interactionId: z.number().int().nullish(),
  favoriteId: z.number().int().nullish(),
  deleted: z.date().nullish(),
})

export interface CompleteBookmark extends z.infer<typeof _BookmarkModel> {
  entry?: CompleteEntry | null
  user: CompleteUser
  state?: CompleteState | null
  tags: CompleteTagging[]
  collections: CompleteCollectionItems[]
  interaction?: CompleteInteraction | null
  favorite?: CompleteFavorite | null
  annotations: CompleteAnnotation[]
}

/**
 * BookmarkModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const BookmarkModel: z.ZodSchema<CompleteBookmark> = z.lazy(() => _BookmarkModel.extend({
  entry: EntryModel.nullish(),
  user: UserModel,
  /**
   * The state in which this bookmark is. A state of null indicates it's been interacted with but not saved.
   */
  state: StateModel.nullish(),
  tags: TaggingModel.array(),
  collections: CollectionItemsModel.array(),
  interaction: InteractionModel.nullish(),
  favorite: FavoriteModel.nullish(),
  annotations: AnnotationModel.array(),
}))
