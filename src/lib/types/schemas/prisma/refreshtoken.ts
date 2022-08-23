import * as z from "zod"

export const RefreshTokenModel = z.object({
  id: z.number().int(),
  refresh_token: z.string(),
  user_id: z.string(),
})
