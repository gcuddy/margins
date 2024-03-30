import * as z from "zod"
import { AnnotationType, Color } from "@prisma/client"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const AnnotationModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  body: z.string().nullish(),
  type: z.nativeEnum(AnnotationType),
  private: z.boolean(),
  target: jsonSchema,
  entryId: z.string().nullish(),
  parentId: z.string().nullish(),
  /**
   * The "soft delete" time. Deletions are cleared after 30 days.
   */
  deleted: z.date().nullish(),
  userId: z.string(),
  sortOrder: z.number(),
  bookmarkId: z.string().nullish(),
  editedAt: z.date().nullish(),
  color: z.string().nullish(),
  contentData: jsonSchema,
  /**
   * Optional title, used for longer notes unassociated with an entryo
   */
  title: z.string().nullish(),
  /**
   * chosenIcon used for documents only?
   */
  chosenIcon: jsonSchema,
  html: z.string().nullish(),
  /**
   * Auto-generated from the target
   */
  quote: z.string().nullish(),
  exact: z.string().nullish(),
  start: z.number().int().nullish(),
  due_timestamp: z.date().nullish(),
  interval_ms: z.bigint().nullish(),
  last_reviewed_at: z.date().nullish(),
  srs: z.boolean(),
  srs_created_at: z.date().nullish(),
  response: z.string().nullish(),
  icon: z.string().nullish(),
  highlight_color: z.nativeEnum(Color),
})
