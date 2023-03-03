import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteFavorite, FavoriteModel, CompleteUser, UserModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const _SmartListModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  icon: imports.chosenIcon,
  filter: jsonSchema,
  conditions: jsonSchema,
  viewOptions: jsonSchema,
  private: z.boolean(),
  description: z.string().nullish(),
  userId: z.string(),
})

export interface CompleteSmartList extends z.infer<typeof _SmartListModel> {
  favorites: CompleteFavorite[]
  user: CompleteUser
}

/**
 * SmartListModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const SmartListModel: z.ZodSchema<CompleteSmartList> = z.lazy(() => _SmartListModel.extend({
  favorites: FavoriteModel.array(),
  user: UserModel,
}))
