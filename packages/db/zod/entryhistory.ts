import * as z from "zod"
import { Status, Status } from "@prisma/client"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const EntryHistoryModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  archivedAt: z.date().nullish(),
  archived: z.boolean().nullish(),
  fromStatus: z.nativeEnum(Status).nullish(),
  toStatus: z.nativeEnum(Status).nullish(),
  fromProgress: z.number().nullish(),
  toProgress: z.number().nullish(),
  seen: z.boolean().nullish(),
  finished: z.boolean().nullish(),
  bookmarked: z.boolean().nullish(),
  toTitle: z.string().nullish(),
  toAuthor: z.string().nullish(),
  userId: z.string().nullish(),
  entryId: z.string(),
  bookmarkId: z.string().nullish(),
  addedTagIds: jsonSchema,
  removedTagIds: jsonSchema,
  addedCollectionIds: jsonSchema,
  removedCollectionIds: jsonSchema,
})
