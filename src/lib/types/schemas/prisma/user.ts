import * as z from "zod"

export const UserModel = z.object({
  id: z.string(),
  username: z.string(),
  identifier_token: z.string(),
  hashed_password: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
