import * as z from "zod"

export const IntegrationModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  serviceName: z.string(),
  accessToken: z.string().nullish(),
  refreshToken: z.string().nullish(),
  expiresIn: z.number().int().nullish(),
  timestamp: z.date().nullish(),
  username: z.string().nullish(),
})
