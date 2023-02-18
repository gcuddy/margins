import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteEntry, EntryModel, CompleteTagging, TaggingModel, CompleteFavorite, FavoriteModel, CompleteSubscription, SubscriptionModel, CompleteContext, ContextModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const _FeedModel = z.object({
  id: z.number().int(),
  /**
   * Deprecated
   */
  itunes_id: z.string().nullish(),
  itunesId: z.number().int().nullish(),
  /**
   * IF we're using a podcast, then we use podcastIndex to save/index entries. Do we even need to save them into our db? Probably — what if pidx goes down, or something.
   */
  podcastIndexId: z.number().int().nullish(),
  feedUrl: z.string().nullish(),
  /**
   * Store lastParsed time to diff against feed updated time
   */
  lastParsed: z.date().nullish(),
  guid: z.string().nullish(),
  title: z.string().nullish(),
  link: z.string().nullish(),
  creator: z.string().nullish(),
  description: z.string().nullish(),
  lastBuildDate: z.date().nullish(),
  imageUrl: z.string().nullish(),
  podcast: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  active: z.boolean(),
  /**
   * Additional data provided by podcastIndex
   */
  podcastIndexData: jsonSchema,
  /**
   * Velocity refers to the amount of times a feed is published per day.
   */
  velocity: z.number().int().nullish(),
})

export interface CompleteFeed extends z.infer<typeof _FeedModel> {
  entries: CompleteEntry[]
  tags: CompleteTagging[]
  favorites: CompleteFavorite[]
  subscriptions: CompleteSubscription[]
  context: CompleteContext[]
}

/**
 * FeedModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const FeedModel: z.ZodSchema<CompleteFeed> = z.lazy(() => _FeedModel.extend({
  entries: EntryModel.array(),
  tags: TaggingModel.array(),
  favorites: FavoriteModel.array(),
  subscriptions: SubscriptionModel.array(),
  context: ContextModel.array(),
}))
