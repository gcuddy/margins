import * as z from "zod"

export const UserModel = z.object({
  id: z.string(),
  email: z.string(),
  identifier_token: z.string(),
  hashed_password: z.string().nullish(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
