import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteUser, UserModel, CompleteFavorite, FavoriteModel } from "./index"

export const _FavoriteFolderModel = z.object({
  id: z.number().int(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
})

export interface CompleteFavoriteFolder extends z.infer<typeof _FavoriteFolderModel> {
  user: CompleteUser
  favorites: CompleteFavorite[]
}

/**
 * FavoriteFolderModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const FavoriteFolderModel: z.ZodSchema<CompleteFavoriteFolder> = z.lazy(() => _FavoriteFolderModel.extend({
  user: UserModel,
  favorites: FavoriteModel.array(),
}))
