import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteUser, UserModel } from "./index"

export const _KeyModel = z.object({
  id: z.string(),
  hashed_password: z.string().nullish(),
  user_id: z.string(),
  primary: z.boolean(),
})

export interface CompleteKey extends z.infer<typeof _KeyModel> {
  user: CompleteUser
}

/**
 * KeyModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const KeyModel: z.ZodSchema<CompleteKey> = z.lazy(() => _KeyModel.extend({
  user: UserModel,
}))
