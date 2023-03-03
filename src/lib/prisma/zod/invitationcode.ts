import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteUser, UserModel } from "./index"

export const _InvitationCodeModel = z.object({
  code: z.string(),
  used: z.boolean(),
  ownerId: z.string(),
  usedById: z.string().nullish(),
})

export interface CompleteInvitationCode extends z.infer<typeof _InvitationCodeModel> {
  owner: CompleteUser
  usedby?: CompleteUser | null
}

/**
 * InvitationCodeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const InvitationCodeModel: z.ZodSchema<CompleteInvitationCode> = z.lazy(() => _InvitationCodeModel.extend({
  owner: UserModel,
  usedby: UserModel.nullish(),
}))
