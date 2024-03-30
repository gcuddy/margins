import * as z from "zod"
import { ViewType } from "@prisma/client"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const ViewPreferencesModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  viewType: z.nativeEnum(ViewType),
  userId: z.string(),
  collectionId: z.number().int().nullish(),
  customViewId: z.number().int().nullish(),
  preferences: jsonSchema,
})
