import * as z from "zod"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const RssFeedItemModel = z.object({
  id: z.number().int(),
  uuid: z.string(),
  title: z.string().nullish(),
  contentSnippet: z.string().nullish(),
  summary: z.string().nullish(),
  description: z.string().nullish(),
  is_read: z.boolean(),
  starred: z.boolean(),
  podcast: z.boolean(),
  duration: z.number().int().nullish(),
  played: z.boolean(),
  image: z.string().nullish(),
  link: z.string().nullish(),
  guid: z.string(),
  pubDate: z.date().nullish(),
  creator: z.string().nullish(),
  author: z.string().nullish(),
  content: z.string().nullish(),
  isoDate: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  rssFeedId: z.number().int(),
  enclosure: jsonSchema,
})
