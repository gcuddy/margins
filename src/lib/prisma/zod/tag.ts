import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteFavorite, FavoriteModel, CompleteUser, UserModel, CompleteTagging, TaggingModel, CompleteEntryTag, EntryTagModel, CompleteEntry, EntryModel, CompleteAnnotation, AnnotationModel, CompleteSubscription, SubscriptionModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const _TagModel = z.object({
  id: z.number().int(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  viewOptions: jsonSchema,
  userId: z.string(),
})

export interface CompleteTag extends z.infer<typeof _TagModel> {
  favorite?: CompleteFavorite | null
  user: CompleteUser
  taggings: CompleteTagging[]
  entryTags: CompleteEntryTag[]
  entries: CompleteEntry[]
  annotations: CompleteAnnotation[]
  subscriptions: CompleteSubscription[]
}

/**
 * TagModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const TagModel: z.ZodSchema<CompleteTag> = z.lazy(() => _TagModel.extend({
  favorite: FavoriteModel.nullish(),
  user: UserModel,
  taggings: TaggingModel.array(),
  entryTags: EntryTagModel.array(),
  entries: EntryModel.array(),
  annotations: AnnotationModel.array(),
  subscriptions: SubscriptionModel.array(),
}))
