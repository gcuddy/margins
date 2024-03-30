import * as z from "zod"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const InteractionModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  is_read: z.boolean().nullish(),
  progress: z.number().nullish(),
  userId: z.string(),
  last_viewed: z.date(),
  last_annotated: z.date(),
  last_interaction: z.date(),
  entryId: z.string(),
  /**
   * The current page, if it's a book
   */
  currentPage: z.number().int().nullish(),
  epsiodes_watched: jsonSchema,
  /**
   * Optionally, a title for the interaction
   */
  title: z.string().nullish(),
  note: z.string().nullish(),
  rating: z.number().int().nullish(),
  seen: z.boolean().nullish(),
  finished: z.date().nullish(),
  started: z.date().nullish(),
  revisit: z.boolean().nullish(),
  private: z.boolean(),
})
