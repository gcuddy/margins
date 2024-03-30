import * as z from "zod"
import { FeatureType } from "@prisma/client"

export const FeatureModel = z.object({
  slug: z.string(),
  enabled: z.boolean(),
  description: z.string().nullish(),
  type: z.nativeEnum(FeatureType).nullish(),
  stale: z.boolean().nullish(),
  lastUsedAt: z.date().nullish(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
  updatedBy: z.number().int().nullish(),
})
