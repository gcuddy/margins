import * as z from "zod"
import { Color } from "@prisma/client"

export const ColorDescriptionModel = z.object({
  userId: z.string(),
  color: z.nativeEnum(Color),
  description: z.string().nullish(),
})
