import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteUser, UserModel } from "./index"

export const _ContextNodeModel = z.object({
  /**
   * context node refers to a source or referrer — for example, a Discord Server, or another user
   */
  id: z.string(),
  name: z.string(),
  url: z.string().nullish(),
  description: z.string().nullish(),
  userId: z.string(),
  refers_to: z.string().nullish(),
})

export interface CompleteContextNode extends z.infer<typeof _ContextNodeModel> {
  owner: CompleteUser
}

/**
 * ContextNodeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const ContextNodeModel: z.ZodSchema<CompleteContextNode> = z.lazy(() => _ContextNodeModel.extend({
  owner: UserModel,
}))
