import * as z from "zod"
import * as imports from "../zod-utils"
import { Location, DocumentType } from "@prisma/client"
import { CompleteEntryData, EntryDataModel, CompleteFeed, FeedModel, CompleteRelation, RelationModel, CompleteInteraction, InteractionModel, CompleteEntryMedia, EntryMediaModel, CompleteAnnotation, AnnotationModel, CompleteBookmark, BookmarkModel, CompleteTag, TagModel, CompleteEntryTag, EntryTagModel, CompleteContext, ContextModel, CompleteCollectionItems, CollectionItemsModel, CompleteFavorite, FavoriteModel, CompleteLog, LogModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const _EntryModel = z.object({
  createdAt: z.coerce.date(),
  author: z.string().nullish(),
  location: z.nativeEnum(Location).nullish(),
  title: z.string().nullish(),
  type: z.nativeEnum(DocumentType),
  updatedAt: z.date(),
  id: z.number().int(),
  uri: z.string().nullish(),
  html: z.string().nullish(),
  text: z.string().nullish(),
  image: z.string().nullish(),
  guid: z.string().nullish(),
  /**
   * Original represents original data (html, title) in case we've re-download and/or changes...?
   */
  original: jsonSchema,
  wordCount: z.number().int().nullish(),
  siteName: z.string().nullish(),
  summary: z.string().nullish(),
  pageCount: z.number().int().nullish(),
  screenshot: z.string().nullish(),
  media: jsonSchema,
  published: z.date().nullish(),
  updated: z.date().nullish(),
  podcastIndexId: z.bigint().nullish(),
  googleBooksId: z.string().nullish(),
  enclosureUrl: z.string().nullish(),
  enclosureLength: z.number().int().nullish(),
  enclosureType: z.string().nullish(),
  schemaOrg: imports.schemaOrgSchemas,
  extended: imports.EntryExtendedSchema,
  /**
   * The TMDB id, if it's a movie or TV show.
   */
  tmdbId: z.number().int().nullish(),
  /**
   * Youtube ID, if it's a youtube video
   */
  youtubeId: z.string().nullish(),
  /**
   * Tmdb data - could also store this in "original"?
   */
  tmdbData: jsonSchema,
  /**
   * The duration of the entry, in seconds
   */
  duration: z.number().int().nullish(),
  feedId: z.number().int().nullish(),
  recipe: imports.recipeSchema,
})

export interface CompleteEntry extends z.infer<typeof _EntryModel> {
  data: CompleteEntryData[]
  feed?: CompleteFeed | null
  relations: CompleteRelation[]
  back_relations: CompleteRelation[]
  interactions: CompleteInteraction[]
  EntryMedia: CompleteEntryMedia[]
  annotations: CompleteAnnotation[]
  bookmarks: CompleteBookmark[]
  tags: CompleteTag[]
  entrytags: CompleteEntryTag[]
  context: CompleteContext[]
  CollectionItems: CompleteCollectionItems[]
  favorites: CompleteFavorite[]
  log: CompleteLog[]
}

/**
 * EntryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const EntryModel: z.ZodSchema<CompleteEntry> = z.lazy(() => _EntryModel.extend({
  data: EntryDataModel.array(),
  feed: FeedModel.nullish(),
  relations: RelationModel.array(),
  back_relations: RelationModel.array(),
  interactions: InteractionModel.array(),
  EntryMedia: EntryMediaModel.array(),
  annotations: AnnotationModel.array(),
  bookmarks: BookmarkModel.array(),
  tags: TagModel.array(),
  entrytags: EntryTagModel.array(),
  context: ContextModel.array(),
  CollectionItems: CollectionItemsModel.array(),
  favorites: FavoriteModel.array(),
  log: LogModel.array(),
}))
