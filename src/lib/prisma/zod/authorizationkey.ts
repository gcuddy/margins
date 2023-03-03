import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteUser, UserModel } from "./index"

export const _AuthorizationKeyModel = z.object({
  id: z.string(),
  userId: z.string(),
})

export interface CompleteAuthorizationKey extends z.infer<typeof _AuthorizationKeyModel> {
  user: CompleteUser
}

/**
 * AuthorizationKeyModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const AuthorizationKeyModel: z.ZodSchema<CompleteAuthorizationKey> = z.lazy(() => _AuthorizationKeyModel.extend({
  user: UserModel,
}))
