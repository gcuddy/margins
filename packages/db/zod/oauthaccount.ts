import * as z from "zod"

export const OAuthAccountModel = z.object({
  provider_id: z.string(),
  provider_user_id: z.string(),
  user_id: z.string(),
})
