import { z } from "zod";

export const subscriptionUpdateInput = z.object({
    id: z.number(),
    data: z.object({
        title: z.string(),
        tagIds: z.number().array(),
    }).partial()
})
