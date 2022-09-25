import * as z from "zod"

export const UserModel = z.object({
  id: z.string(),
  username: z.string(),
  hashed_password: z.string().nullish(),
  identifier_token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
