import * as z from "zod"

export const UserModel = z.object({
  id: z.string(),
  provider_id: z.string(),
  hashed_password: z.string().nullish(),
  email: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
