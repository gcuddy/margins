import * as z from "zod"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const AnnotationTargetModel = z.object({
  id: z.number().int(),
  source: z.string(),
  selectors: jsonSchema,
  rangeSelectorId: z.number().int().nullish(),
  textPositionSelectorId: z.number().int().nullish(),
  textQuoteSelectorId: z.number().int(),
})
