import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteUser, UserModel, CompleteEntry, EntryModel, CompleteFeed, FeedModel } from "./index"

export const _ContextModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  userId: z.string(),
  entryId: z.number().int().nullish(),
  feedId: z.number().int().nullish(),
  url: z.string().nullish(),
  description: z.string().nullish(),
})

export interface CompleteContext extends z.infer<typeof _ContextModel> {
  user: CompleteUser
  entry?: CompleteEntry | null
  feed?: CompleteFeed | null
}

/**
 * ContextModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const ContextModel: z.ZodSchema<CompleteContext> = z.lazy(() => _ContextModel.extend({
  user: UserModel,
  entry: EntryModel.nullish(),
  feed: FeedModel.nullish(),
}))
