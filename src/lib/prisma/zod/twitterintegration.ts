import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteUser, UserModel } from "./index"

export const _TwitterIntegrationModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  accessToken: z.string().nullish(),
  refreshToken: z.string().nullish(),
  expiresIn: z.number().int(),
  twitterId: z.string(),
})

export interface CompleteTwitterIntegration extends z.infer<typeof _TwitterIntegrationModel> {
  user: CompleteUser
}

/**
 * TwitterIntegrationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const TwitterIntegrationModel: z.ZodSchema<CompleteTwitterIntegration> = z.lazy(() => _TwitterIntegrationModel.extend({
  user: UserModel,
}))
