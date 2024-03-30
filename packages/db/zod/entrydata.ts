import * as z from "zod"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const EntryDataModel = z.object({
  id: z.number().int(),
  html: z.string().nullish(),
  text: z.string().nullish(),
  image: z.string().nullish(),
  wordCount: z.number().int().nullish(),
  summary: z.string().nullish(),
  published: z.date().nullish(),
  updated: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  data: jsonSchema,
  entryId: z.string(),
  custom: jsonSchema,
})
