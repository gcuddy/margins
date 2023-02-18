import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteUser, UserModel, CompleteCollectionItems, CollectionItemsModel, CompleteFavorite, FavoriteModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const _CollectionModel = z.object({
  id: z.number().int(),
  name: z.string(),
  private: z.boolean(),
  icon: imports.chosenIcon,
  userId: z.string(),
  description: z.string().nullish(),
  contentData: jsonSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteCollection extends z.infer<typeof _CollectionModel> {
  user: CompleteUser
  items: CompleteCollectionItems[]
  favorites: CompleteFavorite[]
}

/**
 * CollectionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const CollectionModel: z.ZodSchema<CompleteCollection> = z.lazy(() => _CollectionModel.extend({
  user: UserModel,
  items: CollectionItemsModel.array(),
  favorites: FavoriteModel.array(),
}))
