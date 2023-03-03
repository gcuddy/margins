import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteUser, UserModel } from "./index"

export const _ArticleModel = z.object({
  id: z.number().int(),
  title: z.string(),
  content: z.string().nullish(),
  textContent: z.string().nullish(),
  author: z.string().nullish(),
  private: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  readProgress: z.number().nullish(),
  slug: z.string().nullish(),
  url: z.string().nullish(),
  siteName: z.string().nullish(),
  colorHash: z.string().nullish(),
  date: z.date().nullish(),
  image: z.string().nullish(),
  wordCount: z.number().int().nullish(),
  starred: z.boolean(),
  css: z.string().nullish(),
  description: z.string().nullish(),
  wiki: z.string().nullish(),
  classification: z.string().nullish(),
  pdf: z.boolean().nullish(),
  html: z.string().nullish(),
  readLater: z.boolean(),
  bookmark: z.boolean(),
  position: z.number().int(),
  trash: z.boolean(),
  location: z.string(),
  type: z.number().int(),
  userId: z.string(),
  favoriteId: z.number().int().nullish(),
})

export interface CompleteArticle extends z.infer<typeof _ArticleModel> {
  user: CompleteUser
}

/**
 * ArticleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const ArticleModel: z.ZodSchema<CompleteArticle> = z.lazy(() => _ArticleModel.extend({
  user: UserModel,
}))
