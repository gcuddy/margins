import * as z from "zod"

export const PodcastEpisodeModel = z.object({
  id: z.number().int(),
  podcastId: z.string(),
  hash: z.string(),
  guid: z.string().nullish(),
  url: z.string().nullish(),
})
