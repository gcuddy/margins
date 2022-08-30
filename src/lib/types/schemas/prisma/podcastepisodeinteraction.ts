import * as z from "zod"

export const PodcastEpisodeInteractionModel = z.object({
  id: z.number().int(),
  timestamp: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().nullish(),
  episodeId: z.number().int(),
  hash: z.string(),
})
