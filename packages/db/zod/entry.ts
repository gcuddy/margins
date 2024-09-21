import * as z from "zod"
import { Entry_location, DocumentType, BookGenre } from "@prisma/client"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const EntryModel = z.object({
  createdAt: z.date(),
  author: z.string().nullish(),
  location: z.nativeEnum(Entry_location).nullish(),
  title: z.string().nullish(),
  type: z.nativeEnum(DocumentType),
  updatedAt: z.date(),
  id: z.string(),
  uri: z.string().nullish(),
  html: z.string().nullish(),
  text: z.string().nullish(),
  image: z.string().nullish(),
  guid: z.string().nullish(),
  wordCount: z.number().int().nullish(),
  siteName: z.string().nullish(),
  summary: z.string().nullish(),
  media: jsonSchema,
  published: z.date().nullish(),
  updated: z.date().nullish(),
  feedId: z.number().int().nullish(),
  /**
   * Original represents original data (html, title) in case we've re-download and/or changes...?
   */
  original: jsonSchema,
  recipe: jsonSchema,
  podcastIndexId: z.bigint().nullish(),
  /**
   * The duration of the entry, in seconds
   */
  duration: z.number().int().nullish(),
  enclosureLength: z.number().int().nullish(),
  enclosureType: z.string().nullish(),
  enclosureUrl: z.string().nullish(),
  googleBooksId: z.string().nullish(),
  /**
   * The TMDB id, if it's a movie or TV show.
   */
  tmdbId: z.number().int().nullish(),
  schemaOrg: jsonSchema,
  /**
   * Tmdb data - could also store this in "original"?
   */
  tmdbData: jsonSchema,
  screenshot: z.string().nullish(),
  extended: jsonSchema,
  /**
   * Youtube ID, if it's a youtube video
   */
  youtubeId: z.string().nullish(),
  pageCount: z.number().int().nullish(),
  genres: z.string().nullish(),
  language: z.string().nullish(),
  /**
   * The publisher for books, label for music, production company for movies/tv, company for plays, etc.
   */
  publisher: z.string().nullish(),
  author_extra: jsonSchema,
  spotifyId: z.string().nullish(),
  owned_by_id: z.string().nullish(),
  pdf_fingerprint: z.string().nullish(),
  estimatedReadingTime: z.number().int().nullish(),
  book_genre: z.nativeEnum(BookGenre).nullish(),
  publicId: z.string().nullish(),
  user_id: z.string().nullish(),
  parent_id: z.string().nullish(),
})
