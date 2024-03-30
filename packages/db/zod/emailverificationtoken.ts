import * as z from "zod"

export const EmailVerificationTokenModel = z.object({
  id: z.number().int(),
  code: z.string(),
  email: z.string(),
  expires: z.date(),
  user_id: z.string(),
})
