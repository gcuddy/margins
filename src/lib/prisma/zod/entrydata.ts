import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteEntryMedia, EntryMediaModel, CompleteEntry, EntryModel, CompleteUser, UserModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const _EntryDataModel = z.object({
  id: z.number().int(),
  html: z.string().nullish(),
  text: z.string().nullish(),
  custom: jsonSchema,
  image: z.string().nullish(),
  wordCount: z.number().int().nullish(),
  summary: z.string().nullish(),
  data: jsonSchema,
  published: z.date().nullish(),
  updated: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  entryId: z.number().int(),
  userId: z.string(),
})

export interface CompleteEntryData extends z.infer<typeof _EntryDataModel> {
  media: CompleteEntryMedia[]
  entry: CompleteEntry
  user: CompleteUser
}

/**
 * EntryDataModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const EntryDataModel: z.ZodSchema<CompleteEntryData> = z.lazy(() => _EntryDataModel.extend({
  media: EntryMediaModel.array(),
  entry: EntryModel,
  user: UserModel,
}))
