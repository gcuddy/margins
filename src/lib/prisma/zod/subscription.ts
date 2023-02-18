import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteFeed, FeedModel, CompleteUser, UserModel } from "./index"

export const _SubscriptionModel = z.object({
  id: z.number().int(),
  feedId: z.number().int(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  title: z.string(),
  download_full: z.boolean(),
})

export interface CompleteSubscription extends z.infer<typeof _SubscriptionModel> {
  feed: CompleteFeed
  user: CompleteUser
}

/**
 * SubscriptionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const SubscriptionModel: z.ZodSchema<CompleteSubscription> = z.lazy(() => _SubscriptionModel.extend({
  feed: FeedModel,
  user: UserModel,
}))
